/*
<javascriptresource>
<name>オブジェクトで型抜き</name>
</javascriptresource>
*/

// Ver.1.0 : 2024/05/14
// Ver.1.1 : 2024/07/26

#target illustrator


SELF = (function(){
    try {app.documents.test()}
    catch(e) {return File(e.fileName)}
})();

// 外部のJSXを読み込む
//$.evalFile(SELF.path + "/" + "TomIIllustLib.jsx");  
 
main();


function main()
{
    try
    {
        var thePathObj;
        if ( thePathObj = GetSelectedGroup(), thePathObj == undefined ) throw new Error("グループを1づだけ選択してね");

        var PaintColor;
        {
            var PathItemObj;
            if ( PathItemObj = FindPathInGroup(thePathObj), PathItemObj == undefined )
            {
                if ( PathItemObj = FindcompoundPathItemsInGroup(thePathObj), PathItemObj == undefined ) throw new Error("グループ化された型抜き用のパスがありません");
                PaintColor = activeDocument.defaultFillColor;
            }
             else
            {
                PaintColor = PathItemObj.pathItems[0].fillColor;
 //              $.writeln(PathItemObj.pathItems[0].fillColor.properties());
            }
        }
 
        const GpExtrudingPattern = AddGroup( "<Extruding Pattern>" );           // 抜きパターン用のグループ追加;
        const GpPaintingPattern  = AddGroup( "<Painti>" );                      // 塗りパターン用のグループ追加;
    
        // フォルダーで、抜きパターンを作成
        {
            GpExtrudingPattern.opacity = 0;                                      // 不透明度を0%にする        
            MoveToGroup( GpExtrudingPattern );                              // 追加したグループ内に、線に用いるオブジェクトを移動させる   
 
            // 白の矩形を追加 (少し大き目)
            { 
                const Wid = 40; // 20では少ない
                var rect = GpExtrudingPattern.pathItems.rectangle(GpExtrudingPattern.top+Wid, GpExtrudingPattern.left-Wid, GpExtrudingPattern.width+2*Wid , GpExtrudingPattern.height+2*Wid );		// 縦横のサイズをドキュメントと同じサイズに設定
                rect.stroked = false; // 枠線の有無 
                rect.fillColor = new CMYKColor(0,0,0,0);
                rect.name = "<Inversion>";
            }
            
            GpExtrudingPattern.selected = true;                     // 追加したグループを選択する
            app.redraw();                                           // 再描画させ、選択を反映させる
            app.executeMenuCommand( "Live Pathfinder Exclude" );    // 追加したグループに中ヌキを適用
        }

        // フォルダーで、ベース用の矩形を作成
        {
            // ベース用の矩形を追加
            {
                var rect = GpPaintingPattern.pathItems.rectangle(GpExtrudingPattern.top, GpExtrudingPattern.left, GpExtrudingPattern.width, GpExtrudingPattern.height);
                rect.name = "<Base Color>";
                rect.stroked = false;													// 枠線の有無                
                rect.fillColor = PaintColor; 
            }

            GpPaintingPattern.selected = true;                      // 追加したグループを選択する
            app.redraw();                                           // 再描画させ、選択を反映させる
        }

        // 選択されたすべてのフォルダーを入れたフォルダを作成 
        {
            var GpParent = AddGroup( "<" + thePathObj.name + ">" ); // さきほど作成したグループを入れるためのグループを追加
            app.redraw();                                           // 再描画させ、選択を反映させる 
             
            MoveToGroupInside( activeDocument.selection, GpParent );                                // そのグループにグループを移動させる
            // GpParent.groupItems[0].locked = true;                // ロックする            
             
            // 元々選択されていたオブジェクトを選択する
           activeDocument.selection = GpParent;	// 選択中のオブジェクトを取得
            
            app.redraw();                                           // 再描画させ、選択を反映させる
        }    
    } // try
    catch(e)
    {
        alert( e.message );
    } // catch
    finally
    {
        app.redraw();                                               // 再描画させる
    } // finally
    
    return true;
}


// 選択されたアイテムを得る 
function GetSelectedGroup()
{
    var RetGr  = undefined ;  
    
    try
    {  
        var thePathObj = activeDocument.selection;
        if ( thePathObj[0] == undefined ) throw new Error("Err");
        RetGr = thePathObj[0];   
    } // try
    catch(e)
    {
    } // catch

    return RetGr;
}
 
 
 // グループ内で選択できそうな複合パスを探す 
function FindcompoundPathItemsInGroup( thePathObj )
{
    var RetGr  = undefined;   
    
    try
    { 
        var PathItemObj = thePathObj; 
        while ( PathItemObj.compoundPathItems.length ==  0 ) PathItemObj = PathItemObj.groupItems[0]; 
        RetGr = PathItemObj;   
    } // try
    catch(e)
    {
    } // catch

    return RetGr;
}


 // グループ内で選択できそうなパスを探す 
function FindPathInGroup( thePathObj )
{
    var RetGr  = undefined;   
    
    try
    { 
        var PathItemObj = thePathObj; 
        while ( PathItemObj.pathItems.length ==  0 ) PathItemObj = PathItemObj.groupItems[0]; 
        RetGr = PathItemObj;   
    } // try
    catch(e)
    {
    } // catch

    return RetGr;
}
 


// グループ追加 
function AddGroup(Name)
{
    var ActiveLayer = activeDocument.activeLayer; 
	var thePathObj = activeDocument.selection;			// 選択中のオブジェクトを取得
    var Gp = ActiveLayer.groupItems.add();			// グループを追加
	Gp.name = Name;											// グループ名を決定
    Gp.move( thePathObj[0], ElementPlacement.PLACEBEFORE );	// 追加したグループを選択位置に移動させる

	return Gp;
}


// グループ内に、オブジェクトを移動させる
 function MoveToGroupInside(Obj, Gp)
{
	// 選択されているオブジェクトを得る
	var ITEM = Obj;
	var ITEMSArray = [];

	if( ITEM.constructor.name !== 'Array' )
	{
		// 配列ごとPUSH
		ITEMSArray.push(ITEM);
	}
	else
	{
		// そのままPUSH
		ITEMSArray = ITEM;
	}

	//Gp.selected = true;

	// moveパラメータ(移動先)
	// ElementPlacement.INSIDE	      指定したオブジェクトの内側
	// ElementPlacement.PLACEBEFORE       指定したオブジェクトの前
	// ElementPlacement.PLACEATBEGINNING  指定したオブジェクトの先頭
	// ElementPlacement.PLACEAFTER        指定したオブジェクトの後
	// ElementPlacement.PLACEATEND        指定したオブジェクトの末尾

    var Count = ITEMSArray.length;
	// 選択オブジェクトをグループ化
	for(i=Count-1; i>=0; i--)
	{
		// ITEMSArrayに入っているオブジェクトをGpに移動させる
		ITEMSArray[i].move(Gp,ElementPlacement.INSIDE);
	}
}


// グループ内に、オブジェクトを移動させる
 function MoveToGroup(Gp)
{
	// 選択されているオブジェクトを得る
	var ITEM = activeDocument.selection;
	var ITEMSArray = [];

	if( ITEM.constructor.name !== 'Array' )
	{
		// 配列ごとPUSH
		ITEMSArray.push(ITEM);
	}
	else
	{
		// そのままPUSH
		ITEMSArray = ITEM;
	}

	//Gp.selected = true;

	// moveパラメータ(移動先)
	// ElementPlacement.INSIDE	      指定したオブジェクトの内側
	// ElementPlacement.PLACEBEFORE       指定したオブジェクトの前
	// ElementPlacement.PLACEATBEGINNING  指定したオブジェクトの先頭
	// ElementPlacement.PLACEAFTER        指定したオブジェクトの後
	// ElementPlacement.PLACEATEND        指定したオブジェクトの末尾

    var Count = ITEMSArray.length;
	// 選択オブジェクトをグループ化
	for(i=Count-1; i>=0; i--)
	{
		// ITEMSArrayに入っているオブジェクトをGpに移動させる
		ITEMSArray[i].move(Gp,ElementPlacement.PLACEATEND);
	}
}


Object.prototype.properties = function (cr) {
  var self = this;
  var cr = cr || ", ";
  var props = [];
  for (var i in self) {
    try {
      props.push(i + ":" + self[i]);
    } catch (e) {
      // props.push(i + ":" + e);
    }
  };
  return props.join(cr);
}


