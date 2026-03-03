/*
<javascriptresource>
<name>選択したオブジェクトをグループ化/name>
</javascriptresource>
*/

// Ver.1.0 : 2024/02/11

#target illustrator


SELF = (function(){
    try {app.documents.test()}
    catch(e) {return File(e.fileName)}
})();

// 外部のJSXを読み込む
 $.evalFile(SELF.path + "/" + "TomIIllustLib.jsx");   

main();


function main()
{
    try
    {        
        var thePathObj = app.activeDocument.selection;	// 選択中のオブジェクトを取得

        // １つのグループが選択されているかを確認する
        if ( thePathObj[0] == undefined )
       {
           throw new Error("グループを1づだけ選択してね");
       }
        
        if ( ! KindOfItem( thePathObj, cKindOfGroupItem) )
        {
            // 選択されているオブジェクトがグループではない場合に、重ね順>最前面へ
            app.executeMenuCommand( "sendToFront" );
        }

        var NewGp = AddGroup( "<GpItem>" );         // グループ追加
        MoveToGroup( NewGp );                       // 追加したグループ内に、オブジェクトを移動させる
    } // try
    catch(e)
    {
        alert( e.message );
        return false;
    } // catch
    finally
    {
        app.redraw();                               // 再描画させる
    } // finally

    return true;
}




