/*
<javascriptresource>
<name>塗りサポーター</name>
</javascriptresource>
*/

// https://ten-artai.com/2015/12/320/#google_vignette. //正統派のエフェクトを扱う例
// https://webtan.impress.co.jp/e/2016/06/07/23018　　　 // 外字


// 今見えているウィンドウの大きさ
// activeDocument.views[0].bounds

//自分のファイル名
//*拡張子あり
//activeDocument.fullName.fsName.split("/").reverse()[0]
//*拡張子なし
//activeDocument.fullName.fsName.split("/").reverse()[0].split(".")[0]


// Ver.1.0 : 2025/12/26

#target illustrator
#targetengine "main"

$.localize = true;

SELF = (function(){
    try {app.documents.test()}
    catch(e) {return File(e.fileName)}
})();

// 外部のJSXを読み込む
$.evalFile(SELF.path + "/ZazLib/" + "SupprtFuncLib.jsx");
$.evalFile(SELF.path + "/ZazLib/" + "PaletteWindow.jsx");


 // ツール文字
 var cAdobeDirectObjectSelectTool = 'Adobe Direct Object Select Tool';      // グループ選択
 var cAdobeEyedropperTool         = 'Adobe Eyedropper Tool';                // スポイト
 var cAdobeBlobBrushTool          = 'Adobe Blob Brush Tool';                // 塗りブラシ
 var cdAobeEraserTool             = 'Adobe Eraser Tool';                    // 消しゴム


//-----------------------------------
// クラス CViewDLg
//-----------------------------------
   
 
// メンバー変数
    var m_TheObject;
    var m_RadioBtnAngle01;
    var m_RadioBtnAngle02;
    var m_RadioBtnAngle03;

// コンストラクタ    
function CViewDLg( DlgName, InstanceName ) {
       
    // 初期化
    const m_TheObject = this;
    CPaletteWindow.call( m_TheObject );         // コンストラクタ
    m_TheObject.InitDialog( DlgName );          // イニシャライザ
    m_TheObject.InitInstance( InstanceName );   // インスタンス初期化
    var xDlg = m_TheObject.GetDlg();            // ダイアログへのオブジェクトを得る

    var btnwhdth = 70;
    var btnheiht = 30;
    var sldrwhdth = 150;

    var m_ToolName = cAdobeDirectObjectSelectTool;   // グループ選択

    var objPannel01 = xDlg.add("panel");
    objPannel01.text = "ビュー回転";
    //objPannel01.orientation = "row";    // パネル内の要素を横に並べる
    //objPannel01.alignChildren = ["center", "top"];
    //objPannel01.bounds = [0,0,btnwhdth+sldrwhdth+btnwhdth+20,60];

    // --- 1行目 (横並びグループ1) ---
    var objPannel01Group = objPannel01.add("group");
    objPannel01Group.orientation = "row"; // 1行目の中身は横に並べる

    // --- 2行目 (横並びグループ1) ---
    var objPannel02Group = objPannel01.add("group");
    objPannel02Group.orientation = "row"; // 1行目の中身は横に並べる


    // ダイアログにボタン追加
    m_BtnResizeDown = objPannel01Group.add("button");
    m_BtnResizeDown.text = "↻";
    m_BtnResizeDown.preferredSize = [30, 30];

    m_BtnResizeDown.onClick = function() {
        try
        {
                m_TheObject.CallFunc( "RotateRight_Func" );
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    // ダイアログにボタン追加
    m_BtnInitRotate = objPannel01Group.add("button");
    m_BtnInitRotate.text = "★";
    m_BtnInitRotate.preferredSize = [20, 20];
    m_BtnInitRotate.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "InitRotate_Func" );
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    // ダイアログにボタン追加
    m_BtnResizeUp = objPannel01Group.add("button");
    m_BtnResizeUp.text= "↺";
    m_BtnResizeUp.preferredSize = [30, 30];
    m_BtnResizeUp.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "RotateLeft_Func" );
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    m_RadioBtnAngle02 = objPannel02Group.add("radiobutton");
    m_RadioBtnAngle02.text = "↻ 90度"
    m_RadioBtnAngle02.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "RightTurn_Func" );
        }
        catch(e)
        {
            alert( e.message );
        }
    }

    m_RadioBtnAngle01 = objPannel02Group.add("radiobutton");
    m_RadioBtnAngle01.text = "↺ 90度"
    m_RadioBtnAngle01.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "LeftTurn_Func" );
        }
        catch(e)
        {
            alert( e.message );
        }
    }

    m_RadioBtnAngle03 = objPannel02Group.add("radiobutton");
    m_RadioBtnAngle03.text = "180度"
    m_RadioBtnAngle03.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "UptoTurn_Func" );
        }
        catch(e)
        {
            alert( e.message );
        }
    }

    // ダイアログにボタン追加
    m_BtnSimplify = m_TheObject.AddButton("( Undo )");
    m_BtnSimplify.onClick = function() {
        try
        {
            app.executeMenuCommand("undo");;
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    // ダイアログにボタン追加
    m_BtnSimplify = m_TheObject.AddButton("( パス単純化 )");
    m_BtnSimplify.onClick = function() {
        try
        {
            app.executeMenuCommand("simplify menu item");
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    var objPannel02 = xDlg.add("panel");
    objPannel02.text = "ツール";

    m_GrCheckbox = objPannel02.add("checkbox");
    m_GrCheckbox.text = "パス・チェック"
    m_GrCheckbox.value = true;              // アイテムが選択されているか監視する

    m_RadioBtnBlobBrush = objPannel02.add("radiobutton");
    m_RadioBtnBlobBrush.text = "塗りブラシ";
    m_RadioBtnBlobBrush.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "BlobBrush_Func" );
        }
        catch(e)
        {
            alert( e.message );
        }
    }

    m_RadioBtnEraser = objPannel02.add("radiobutton");
    m_RadioBtnEraser.text = "消しゴム";
    m_RadioBtnEraser.onClick = function() {
        m_TheObject.CallFunc( "Eraser_Func" );
    }

    m_RadioBtnObjectSelect = objPannel02.add("radiobutton");
    m_RadioBtnObjectSelect.text = "グループ選択";
    m_RadioBtnObjectSelect.onClick = function() {
        m_TheObject.CallFunc( "ObjectSelect_Func" ); 
    }

    m_objRb01 = objPannel02.add("radiobutton");
    m_objRb01.text = "スポイト";
    m_objRb01.onClick = function() {
        m_TheObject.CallFunc( "EyedropperTool_Func" );      
    }

    // ダイアログにボタン追加
    m_BtnFitIn = m_TheObject.AddButton("( 全体を表示 )");
    m_BtnFitIn.onClick = function() {
        try
        {
            app.executeMenuCommand('fitin');
        }
        catch(e)
        {
            alert( e.message );
        } 
    }    

    // ダイアログにボタン追加
    m_BtnSimplify = m_TheObject.AddButton("( 選択されたアイテムを塗りつぶし )");
    m_BtnSimplify.onClick = function() {
        try
        {
            m_TheObject.CallFunc( "NoCompoundFunc" );
        }
        catch(e)
        {
            alert( e.message );
        } 
    }

    // ダイアログにボタン追加
    m_BtnCancel = m_TheObject.AddButton( "閉じる" );
    m_BtnCancel.onClick = function () {
        try
        {      
            m_TheObject.CloseDlg();
        }
        catch(e)
        {
            alert( e.message );
        }
    }

    m_TheObject.SetAdobeTool(m_ToolName);   // 起動時のツールを指定する
    
} // コンストラクタ


CViewDLg.prototype = CPaletteWindow.prototype; // サブクラスのメソッド追加よりも先に、継承させること
    

// 追加したいソッドをここで定義
CViewDLg.prototype.NoSeledtedAngle = function() {
    m_RadioBtnAngle01.value = false;
    m_RadioBtnAngle02.value = false;
    m_RadioBtnAngle03.value = false;
}

// 追加したいソッドをここで定義
CViewDLg.prototype.SetAdobeTool = function(TlName) {
    m_ToolName = TlName;
    app.selectTool(m_ToolName);
        
    m_RadioBtnObjectSelect.value = false;
    m_objRb01.value = false;
    m_RadioBtnBlobBrush.value = false;
    m_RadioBtnEraser.value = false;

     if ( m_ToolName == cAdobeDirectObjectSelectTool ) {  // グループ選択
        m_RadioBtnObjectSelect.value = true;
    }

    if ( m_ToolName == cAdobeEyedropperTool ) {         // スポイト
        m_objRb01.value = true;
    }

    if ( m_ToolName == cAdobeBlobBrushTool ) {          // 塗りブラシ
        m_RadioBtnBlobBrush.value = true;
    }

    if ( m_ToolName == cdAobeEraserTool ) {            // 消しゴム
        m_RadioBtnEraser.value = true;
    }
}

 // 追加したいソッドをここで定義
 CViewDLg.prototype.JugeKindOfItem = function() {
    var doc = app.activeDocument;
    var selectionCount = doc.selection.length;
    var tFlag = true;

    if ( selectionCount >=1 ) {
        var SelectedItemX = doc.selection[0];
        if ( KindOfItem(SelectedItemX, cKindOfPathItem) || KindOfItem(SelectedItemX, cCompoundPathItem) || KindOfItem(SelectedItemX, cKindOfGroupItem) ) {
            tFlag = false;
        }
    }

    return tFlag;
}

// 追加したいソッドをここで定義 
CViewDLg.prototype.ObjectSelect_Func = function()
{
    try
    {
        app.executeMenuCommand("deselectall");               // 選択を解除
        this.SetAdobeTool(cAdobeDirectObjectSelectTool);   // 塗グループ選択
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
}
      
// 追加したいソッドをここで定義
CViewDLg.prototype.EyedropperTool_Func = function()
{
    try
    {
        this.SetAdobeTool(cAdobeEyedropperTool);   // スポイト  
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
}

// 追加したいソッドをここで定義
CViewDLg.prototype.BlobBrush_Func = function()
{
    try
    {
        // アイテムが選択されている条件で、app.selectTool('Adobe Blob Brush Tool')を実施するか判定
        if ( m_GrCheckbox.value ) {
            if ( this.JugeKindOfItem() ) {
                this.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        this.SetAdobeTool(cAdobeBlobBrushTool);   // 塗りブラシ 
   } // try
   catch(e)
   {
       alert( e.message );
   } // catch
   finally
   {
       //app.redraw();                                  // 再描画させる
   } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.Eraser_Func = function()
{
    try
    {
        // アイテムが選択されている条件で、app.selectTool('Adobe Eraser Tool')を実施するか判定
        if ( m_GrCheckbox.value ) {
            if ( this.JugeKindOfItem() ) {
                this.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        this.SetAdobeTool(cdAobeEraserTool);      // 消しゴム 
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.InitRotate_Func = function()
{
    try
    {
        app.activeDocument.activeView.rotateAngle = 0;
        this.NoSeledtedAngle();
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.RotateRight_Func = function()
{
    try
    {
        var vtac = 0.1;
        var vang = 5;         
        //app.activeDocument.views[0].zoom += vtac;     // zoom
        //alert(app.activeDocument.activeView.rotate );
        if ( app.activeDocument.activeView.rotateAngle > -180 )
        {
            app.activeDocument.activeView.rotateAngle += vang;
        }
    } // try
    catch(e)
    {
        alert( e.message );
    } // catch
    finally
    {
        //app.redraw();                                  // 再描画させる
    } // finally
  
}

// 追加したいソッドをここで定義
CViewDLg.prototype.RotateLeft_Func = function()
{
    try
    { 
        var vtac = 0.1;
        var vang = 5;          
        //app.activeDocument.views[0].zoom -= vtac;     // zoom
        //alert(app.activeDocument.activeView.rotate );
        if ( app.activeDocument.activeView.rotateAngle < 180 )
        {
            app.activeDocument.activeView.rotateAngle -= vang;
        }              
    } // try
    catch(e)
    {
        alert( e.message );
    } // catch
    finally
    {
        //app.redraw();                                  // 再描画させる
    } // finally
  
 }

// 追加したいソッドをここで定義
CViewDLg.prototype.LeftTurn_Func = function()
{
    try
    {
        var angleV = app.activeDocument.activeView.rotateAngle;
        angleV -=90;
        if ( angleV < -180 )
        {
            angleV += 180;
            angleV = -angleV;
        }
        app.activeDocument.activeView.rotateAngle = angleV;
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.RightTurn_Func = function()
{
    try
    {
        var angleV = app.activeDocument.activeView.rotateAngle;
        angleV +=90;
        if ( angleV > 180 )
        {
            angleV -= 180;
            angleV = -angleV;
        }
        app.activeDocument.activeView.rotateAngle = angleV;
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.UptoTurn_Func = function()
{
    try
    {
        app.activeDocument.activeView.rotateAngle += 180;
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

// 追加したいソッドをここで定義
CViewDLg.prototype.NoCompoundFunc = function()
{
    try
    {
        var ActiveLayer = activeDocument.activeLayer;
        var doc = app.activeDocument;
        var selectionCount = doc.selection.length;

        if ( selectionCount == 1 && KindOfItem(doc.selection[0], cCompoundPathItem ) ) {
            app.executeMenuCommand("noCompoundPath");   // 複合パス解除

            do {
                ActiveLayer.pathItems[0].remove();
            } while ( ActiveLayer.pathItems.length > 2) ;
        }
        else{
            alert("先に、アイテムを１つだけに選択し直してください");
        }
    } // try
    catch(e)
    {
       alert( e.message );
    } // catch
    finally
    {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}


function escExit(event) {
    if(event.keyName === 'Escape'){
        alert( "終わります。" );
        DlgPaint.CloseDlg();
    }
 }
 
var DlgPaint = new CViewDLg( "塗りサポーター", "DlgPaint" );  //インスタンスを生成
    DlgPaint.addEventListener( 'keydown',  escExit );

main();

function main()
{    
    // バージョン・チェック
    if ( appVersion()[0]  >= 24 )
    {
        DlgPaint.ShowDlg(); 
    }
    else
    {
         var msg = {en : 'This script requires Illustrator 2020.', ja : 'このスクリプトは Illustrator 2020以降に対応しています。'} ;
        alert(msg) ; 
    }
}
