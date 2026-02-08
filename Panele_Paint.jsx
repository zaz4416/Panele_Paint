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


// Ver.1.0 : 2026/02/08

#target illustrator
#targetengine "main"


// スクリプト実行時に外部のJSXを読み込む (#includeにすると、main関数が終了した時点で、ダイアログが表示されなくなる)
$.evalFile(GetScriptDir() + "ZazLib/PaletteWindow.jsx");
$.evalFile(GetScriptDir() + "ZazLib/SupprtFuncLib.jsx");


// 言語ごとの辞書を定義
var MyDictionary = {
    GUI_JSX: {
        en : "GUI/Panele_Paint/ScriptUI Dialog Builder - Export_EN.jsx",
        ja : "GUI/Panele_Paint/ScriptUI Dialog Builder - Export_JP.jsx"
    }
};

// --- LangStringsの辞書から自動翻訳処理 ---
var LangStrings = GetWordsFromDictionary( MyDictionary );

// オブジェクトの最大保持数
var _MAX_INSTANCES = 5;

 // ツール文字
 var cAdobeDirectObjectSelectTool = 'Adobe Direct Object Select Tool';      // グループ選択
 var cAdobeEyedropperTool         = 'Adobe Eyedropper Tool';                // スポイト
 var cAdobeBlobBrushTool          = 'Adobe Blob Brush Tool';                // 塗りブラシ
 var cdAobeEraserTool             = 'Adobe Eraser Tool';                    // 消しゴム



// --- グローバル関数 -----------------------------------------------------------------

/**
 * 実行中スクリプトの親フォルダ（Folderオブジェクト）を返す。
 * なお、戻り値の最後には/が付与される。
 */
function GetScriptDir() {
    var selfFile = null;
    try {
        selfFile = new File(decodeURI($.fileName || Folder.current.fullName));
    } catch (e) {
        return Folder.current.fullName.replace(/\/*$/, "/");
    }
    var dirPath = (selfFile !== null) ? selfFile.parent.fullName : Folder.current.fullName;

    // 末尾にスラッシュがなければ付与して返す
    return dirPath.replace(/\/*$/, "/");
}

// ---------------------------------------------------------------------------------


//-----------------------------------
// クラス CViewDLg
//-----------------------------------
 
//~~~~~~~~~~~~~~~~~~~~
// 1. コンストラクタ定義
//~~~~~~~~~~~~~~~~~~~~
function CViewDLg( scriptName ) {
    CPaletteWindow.call( this, scriptName, _MAX_INSTANCES, false );     // コンストラクタ

    // クラスへのポインタを確保
    var self = this;

    self.m_Dialog.opacity       = 0.7; // （不透明度）

    // GUI用のスクリプトを読み込む
    if ( self.LoadGUIfromJSX( GetScriptDir() + LangStrings.GUI_JSX ) )
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
        
        // 最後に、新しいインスタンスを追加
        self.RegisterInstance();
    }
    else{
        alert("GUIが未定です");
        return;
    }

    var StartToolName = cAdobeDirectObjectSelectTool;   // グループ選択
    self.SetAdobeTool(StartToolName);   // 起動時のツールを指定する
}

//~~~~~~~~~~~~~~
// 2. クラス継承
//~~~~~~~~~~~~~~
ClassInheritance(CViewDLg, CPaletteWindow);


//~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 3. プロトタイプメソッドの定義
//~~~~~~~~~~~~~~~~~~~~~~~~~~~
CViewDLg.prototype.ObjectSelect_Func = function()
{
    try {
        var self = CViewDLg.self;
    
        app.executeMenuCommand("deselectall");               // 選択を解除
        self.SetAdobeTool(cAdobeDirectObjectSelectTool);   // 塗グループ選択
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
}

CViewDLg.prototype.EyedropperTool_Func = function()
{
    try {
        var self = CViewDLg.self;
    
        self.SetAdobeTool(cAdobeEyedropperTool);   // スポイト  
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
}

CViewDLg.prototype.BlobBrush_Func = function()
{
    try {
        var self = CViewDLg.self;

        // アイテムが選択されている条件で、app.selectTool('Adobe Blob Brush Tool')を実施するか判定
        if ( self.m_GrCheckbox.value ) {
            if ( self.JugeKindOfItem() ) {
                self.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        self.m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        self.SetAdobeTool(cAdobeBlobBrushTool);   // 塗りブラシ 
   } // try
   catch(e) {
       alert( e.message );
   } // catch
   finally {
       //app.redraw();                                  // 再描画させる
   } // finally
 
}

CViewDLg.prototype.Eraser_Func = function()
{
    try {        
        var self = CViewDLg.self;

        // アイテムが選択されている条件で、app.selectTool('Adobe Eraser Tool')を実施するか判定
        if ( self.m_GrCheckbox.value ) {
            if ( self.JugeKindOfItem() ) {
                self.SetAdobeTool(m_ToolName);
                throw new Error("先に、パスを選択してください");
            }
        }

        self.m_GrCheckbox.value = true;                  // アイテムが選択されているか監視する
        self.SetAdobeTool(cdAobeEraserTool);      // 消しゴム 
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.InitRotate_Func = function()
{
    try {
        self = CViewDLg.self;

        app.activeDocument.activeView.rotateAngle = 0;
        self.NoSeledtedAngle();
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.RotateRight_Func = function()
{
    try {
        var vtac = 0.1;
        var vang = 5;         
        //app.activeDocument.views[0].zoom += vtac;     // zoom
        //alert(app.activeDocument.activeView.rotate );
        if ( app.activeDocument.activeView.rotateAngle > -180 )
        {
            app.activeDocument.activeView.rotateAngle += vang;
        }
    } // try
    catch(e) {
        alert( e.message );
    } // catch
    finally {
        //app.redraw();                                  // 再描画させる
    } // finally
  
}

CViewDLg.prototype.RotateLeft_Func = function()
{
    try { 
        var vtac = 0.1;
        var vang = 5;          
        //app.activeDocument.views[0].zoom -= vtac;     // zoom
        //alert(app.activeDocument.activeView.rotate );
        if ( app.activeDocument.activeView.rotateAngle < 180 )
        {
            app.activeDocument.activeView.rotateAngle -= vang;
        }              
    } // try
    catch(e) {
        alert( e.message );
    } // catch
    finally {
        //app.redraw();                                  // 再描画させる
    } // finally
  
 }

CViewDLg.prototype.LeftTurn_Func = function()
{
    try {
        var angleV = app.activeDocument.activeView.rotateAngle;
        angleV -=90;
        if ( angleV < -180 )
        {
            angleV += 180;
            angleV = -angleV;
        }
        app.activeDocument.activeView.rotateAngle = angleV;
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.RightTurn_Func = function()
{
    try {
        var angleV = app.activeDocument.activeView.rotateAngle;
        angleV +=90;
        if ( angleV > 180 )
        {
            angleV -= 180;
            angleV = -angleV;
        }
        app.activeDocument.activeView.rotateAngle = angleV;
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.UptoTurn_Func = function()
{
    try {
        app.activeDocument.activeView.rotateAngle += 180;
    } // try
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.NoCompoundFunc = function()
{
    try {
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
    catch(e) {
       alert( e.message );
    } // catch
    finally {
       //app.redraw();                                  // 再描画させる
    } // finally
 
}

CViewDLg.prototype.onRotateRightClick = function() {
    try {
        this.CallFunc( ".RotateRight_Func()" );
    }
    catch(e) {
        alert( e.message );
    } 
}

CViewDLg.prototype.onInitRotateClick = function() {
    try {
        this.CallFunc( ".InitRotate_Func()" );
    }
    catch(e) {
        alert( e.message );
    } 
}

CViewDLg.prototype.onRotateLeftClick = function() {
    try {
        this.CallFunc( ".RotateLeft_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onRightTurnClick = function() {
    try {
        this.CallFunc( ".RightTurn_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onLeftTurnClick = function() {
    try {
        this.CallFunc( ".LeftTurn_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onUptoTurnClick = function() {
    try {
        this.CallFunc( ".UptoTurn_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onUndoClick = function() {
    try {
        app.executeMenuCommand("undo");
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onToSimlePathClick = function() {
    try {
        app.executeMenuCommand("simplify menu item");
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onBlobBrushClick = function() {
    try {
        this.CallFunc( ".BlobBrush_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onEraserClick = function() {
    try {
        this.CallFunc( ".Eraser_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onObjectSelectClick = function() {
    try {
        this.CallFunc( ".ObjectSelect_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onEyedropperToolClick = function() {
    try {
        this.CallFunc( ".EyedropperTool_Func()" );
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onFitinClick = function() {
    try {
        app.executeMenuCommand('fitin');
    }
    catch(e) {
        alert( e.message );
    }
}

CViewDLg.prototype.onNoCompoundClick = function() {
    try {
        this.CallFunc( ".NoCompoundFunc()" );
    }
    catch(e)
    {
        alert( e.message );
    }
}

CViewDLg.prototype.onCloseDlgClick = function() {
    try {
        this.close();
    }
    catch(e){
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
        DlgPaint.close();
    }
 }
 

    

main();

function main()
{    
    // バージョン・チェック
    if ( appVersion()[0]  >= 24 )
    {        // 実行中のスクリプト名を取得（拡張子なし）
        var scriptName = decodeURI(File($.fileName).name).replace(/\.[^\.]+$/, "");

        // 新しいインスタンスを生成
        var Obj  = new CViewDLg( scriptName ) ;
        //Obj.addEventListener( 'keydown',  escExit );     // ESCを監視

        // インデックスをタイトルの先頭に表示
        var Index = Obj.GetGlobalIndex();
        var Title = Obj.GetDialogTitle();
        Obj.SetDialogTitle( "[" + Index + "]" + Title );

        // インスタンスを表示
        Obj.show();
    }
    else
    {
         var msg = {en : 'This script requires Illustrator 2020.', ja : 'このスクリプトは Illustrator 2020以降に対応しています。'} ;
        alert(msg) ; 
    }
}
