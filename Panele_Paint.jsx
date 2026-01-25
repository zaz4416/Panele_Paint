/*
<javascriptresource>
<name>塗りサポーター</name>
</javascriptresource>
*/

// https://ten-artai.com/2015/12/320/#google_vignette.  //正統派のエフェクトを扱う例
// https://webtan.impress.co.jp/e/2016/06/07/23018　　　 // 外字
// https://scriptui.joonas.me/                          // ScriptUI Dialog Builder.


// 今見えているウィンドウの大きさ
// activeDocument.views[0].bounds

//自分のファイル名
//*拡張子あり
//activeDocument.fullName.fsName.split("/").reverse()[0]
//*拡張子なし
//activeDocument.fullName.fsName.split("/").reverse()[0].split(".")[0]


// Ver.1.0 : 2026/01/24

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
// クラス CSurface
//-----------------------------------
function CSurface( DlgName ) {
    CPaletteWindow.call( this,false );       // コンストラクタ
    this.InitDialog( DlgName );              // イニシャライザ

    // インスタンスのコンストラクタ（子クラス自身）の静的プロパティに保存することで、動的に静的プロパティを定義
    this.constructor.TheObj = this;

    // クラスへのポインタを確保
    var self = this;

    // GUI用のスクリプトを読み込む
    var selfFile = new File($.fileName);
    var currentDir = selfFile.parent;
    if ( self.LoadGUIfromJSX( currentDir.fullName + "/GUI.Panele_Paint/ScriptUI Dialog Builder - Export.jsx" ) )
    {
        // GUIに変更を入れる
        self.m_BtnResizeDown.onClick        = function() { self.onRotateRightClick(); }
        self.m_BtnInitRotate.onClick        = function() { self.onInitRotateClick(); }
        self.m_BtnResizeUp.onClick          = function() { self.onRotateLeftClick(); }
        self.m_RadioBtnAngle02.onClick      = function() { self.onRightTurnClick(); }
        self.m_RadioBtnAngle01.onClick      = function() { self.onLeftTurnClick(); }
        self.m_RadioBtnAngle03.onClick      = function() { self.onUptoTurnClick(); }
        self.m_BtnUndo.onClick              = function() { self.onUndoClick(); }
        self.m_BtnSimplify.onClick          = function() { self.onToSimlePathClick(); }
        self.m_RadioBtnBlobBrush.onClick    = function() { self.onBlobBrushClick(); }
        self.m_RadioBtnEraser.onClick       = function() { self.onEraserClick(); }
        self.m_RadioBtnObjectSelect.onClick = function() { self.onObjectSelectClick(); }
        self.m_objRb01.onClick              = function() { self.onEyedropperToolClick(); }
        self.m_BtnFitIn.onClick             = function() { self.onFitinClick() }
        self.m_BtnFillSelectedArea.onClick  = function() { self.onNoCompoundClick(); }
        self.m_BtnCancel.onClick            = function() { self.onCloseDlgClick(); }

        // アイテムが選択されているか監視する
        self.m_GrCheckbox.value = true;              
    }
    else{
        alert("GUIが未定です");
    }
}
ClassInheritance(CSurface, CPaletteWindow); // クラス継承




//-----------------------------------
// クラス CViewDLg
//-----------------------------------
 
//~~~~~~~~~~~~~~~~~~~~
// 1. コンストラクタ定義
//~~~~~~~~~~~~~~~~~~~~
function CViewDLg( DlgName ) {

    CSurface.call( this, DlgName );     // コンストラクタ

    // クラスへのポインタを確保
    var self = this;

    var StartToolName = cAdobeDirectObjectSelectTool;   // グループ選択
    self.SetAdobeTool(StartToolName);   // 起動時のツールを指定する
}

//~~~~~~~~~~~~~~
// 2. クラス継承
//~~~~~~~~~~~~~~
ClassInheritance(CViewDLg, CSurface);

//~~~~~~~~~~~~~~~~~~~~~
// 3. 静的メソッドの定義
//~~~~~~~~~~~~~~~~~~~~~
CViewDLg.ObjectSelect_Func = function()
{
    try
    {
        var Dlg = CViewDLg.TheObj;
    
        app.executeMenuCommand("deselectall");               // 選択を解除
        Dlg.SetAdobeTool(cAdobeDirectObjectSelectTool);   // 塗グループ選択
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

CViewDLg.EyedropperTool_Func = function()
{
    try
    {
        var Dlg = CViewDLg.TheObj;
    
        Dlg.SetAdobeTool(cAdobeEyedropperTool);   // スポイト  
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

CViewDLg.BlobBrush_Func = function()
{
    try
    {
        var Dlg = CViewDLg.TheObj;

        // アイテムが選択されている条件で、app.selectTool('Adobe Blob Brush Tool')を実施するか判定
        if ( m_GrCheckbox.value ) {
            if ( Dlg.JugeKindOfItem() ) {
                Dlg.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        Dlg.SetAdobeTool(cAdobeBlobBrushTool);   // 塗りブラシ 
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

CViewDLg.Eraser_Func = function()
{
    try
    {        
        var Dlg = CViewDLg.TheObj;

        // アイテムが選択されている条件で、app.selectTool('Adobe Eraser Tool')を実施するか判定
        if ( m_GrCheckbox.value ) {
            if ( Dlg.JugeKindOfItem() ) {
                Dlg.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        Dlg.SetAdobeTool(cdAobeEraserTool);      // 消しゴム 
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

CViewDLg.InitRotate_Func = function()
{
    try
    {
        var Dlg = CViewDLg.TheObj;

        app.activeDocument.activeView.rotateAngle = 0;
        Dlg.NoSeledtedAngle();
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

CViewDLg.RotateRight_Func = function()
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

CViewDLg.RotateLeft_Func = function()
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

CViewDLg.LeftTurn_Func = function()
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

CViewDLg.RightTurn_Func = function()
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

CViewDLg.UptoTurn_Func = function()
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

CViewDLg.NoCompoundFunc = function()
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 4. プロトタイプメソッドの定義
//~~~~~~~~~~~~~~~~~~~~~~~~~~~

CViewDLg.prototype.onRotateRightClick = function() {
    try
    {
        this.CallFunc( "RotateRight_Func" );
    }
    catch(e)
    {
        alert( e.message );
    } 
}

CViewDLg.prototype.onInitRotateClick = function() {
    try
    {
        this.CallFunc( "InitRotate_Func" );
    }
    catch(e)
    {
        alert( e.message );
    } 
}

CViewDLg.prototype.onRotateLeftClick = function() {
    try
    {
        this.CallFunc( "RotateLeft_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onRightTurnClick = function() {
    try
    {
        this.CallFunc( "RightTurn_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onLeftTurnClick = function() {
    try
    {
        this.CallFunc( "LeftTurn_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onUptoTurnClick = function() {
    try
    {
        this.CallFunc( "UptoTurn_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onUndoClick = function() {
    try
    {
        app.executeMenuCommand("undo");
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onToSimlePathClick = function() {
    try
    {
        app.executeMenuCommand("simplify menu item");
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onBlobBrushClick = function() {
    try
    {
        this.CallFunc( "BlobBrush_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onEraserClick = function() {
    try
    {
        this.CallFunc( "Eraser_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onObjectSelectClick = function() {
    try
    {
        this.CallFunc( "ObjectSelect_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onEyedropperToolClick = function() {
    try
    {
        this.CallFunc( "EyedropperTool_Func" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onFitinClick = function() {
    try
    {
        app.executeMenuCommand('fitin');
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onNoCompoundClick = function() {
    try
    {
        this.CallFunc( "NoCompoundFunc" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onCloseDlgClick = function() {
    try
    {
        this.CloseDlg();
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.NoSeledtedAngle = function() {
    this.m_RadioBtnAngle01.value = false;
    this.m_RadioBtnAngle02.value = false;
    this.m_RadioBtnAngle03.value = false;
}

CViewDLg.prototype.SetAdobeTool = function(TlName) {
    m_ToolName = TlName;
    app.selectTool(m_ToolName);
    var self = this;
        
    self.m_RadioBtnObjectSelect.value = false;
    self.m_objRb01.value = false;
    self.m_RadioBtnBlobBrush.value = false;
    self.m_RadioBtnEraser.value = false;

     if ( m_ToolName == cAdobeDirectObjectSelectTool ) {  // グループ選択
        self.m_RadioBtnObjectSelect.value = true;
    }

    if ( m_ToolName == cAdobeEyedropperTool ) {         // スポイト
        self.m_objRb01.value = true;
    }

    if ( m_ToolName == cAdobeBlobBrushTool ) {          // 塗りブラシ
        self.m_RadioBtnBlobBrush.value = true;
    }

    if ( m_ToolName == cdAobeEraserTool ) {            // 消しゴム
        self.m_RadioBtnEraser.value = true;
    }
}

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




function escExit(event) {
    if(event.keyName === 'Escape'){
        alert( "終わります。" );
        DlgPaint.CloseDlg();
    }
 }
 
var DlgPaint = new CViewDLg( "塗りサポーター" );  //インスタンスを生成
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
