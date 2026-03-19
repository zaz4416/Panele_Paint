/*
<javascriptresource>
<name>塗りサポーター</name>
</javascriptresource>
*/

// https://ten-artai.com/2015/12/320/#google_vignette.  //正統派のエフェクトを扱う例
// https://webtan.impress.co.jp/e/2016/06/07/23018　　　 // 外字


// 今見えているウィンドウの大きさ
// activeDocument.views[0].bounds

//自分のファイル名
//*拡張子あり
//activeDocument.fullName.fsName.split("/").reverse()[0]
//*拡張子なし
//activeDocument.fullName.fsName.split("/").reverse()[0].split(".")[0]


// Ver.1.0 : 2026/03/19

#target illustrator
#targetengine "main"


// スクリプト実行時に外部のJSXを読み込む (#includeにすると、main関数が終了した時点で、ダイアログが表示されなくなる)
$.evalFile(GetScriptDir() + "ZazLib/ClassInheritance.jsx");
$.evalFile(GetScriptDir() + "ZazLib/Language.jsx");
$.evalFile(GetScriptDir() + "ZazLib/GlobalArray.jsx");
$.evalFile(GetScriptDir() + "ZazLib/PaletteWindow.jsx");
$.evalFile(GetScriptDir() + "ZazLib/SupprtFuncLib.jsx");


// 言語ごとの辞書を定義
var MyDictionary = {
    GUI_JSX: {
        en : "GUI/Panele_Paint/ScriptUI Dialog Builder - Export_EN.jsx",
        ja : "GUI/Panele_Paint/ScriptUI Dialog Builder - Export_JP.jsx"
    },
     Msg_Require: {
        en : "This script requires Illustrator 2020.",
        ja : "このスクリプトは Illustrator 2020以降に対応しています。"
    },
    Msg_cant_run: {
        en: "Can't run",
        ja: "これ以上、起動できません"
    }
};

// --- LangStringsの辞書から自動翻訳処理 ---
var LangStrings = GetWordsFromDictionary( MyDictionary );

// オブジェクトの最大保持数
var _MAX_INSTANCES = 1;

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

    if ( self.IsDialg()) {
        self.m_Dialog.opacity       = 0.7; // （不透明度）

        // GUI用のスクリプトを読み込む
        if ( self.LoadGUIfromJSX( GetScriptDir() + LangStrings.GUI_JSX ) ) {
            // GUIに変更を入れる
            self.m_BtnResizeDown.onClick        = function() { self.CallFunc( ".RotateRight_Func()"    ); }
            self.m_BtnInitRotate.onClick        = function() { self.CallFunc( ".InitRotate_Func()"     ); }
            self.m_BtnResizeUp.onClick          = function() { self.CallFunc( ".RotateLeft_Func()"     ); }
            self.m_RadioBtnAngle02.onClick      = function() { self.CallFunc( ".RightTurn_Func()"      ); }
            self.m_RadioBtnAngle01.onClick      = function() { self.CallFunc( ".LeftTurn_Func()"       ); }
            self.m_RadioBtnAngle03.onClick      = function() { self.CallFunc( ".UptoTurn_Func()"       ); }
            self.m_RadioBtnBlobBrush.onClick    = function() { self.CallFunc( ".BlobBrush_Func()"      ); }
            self.m_RadioBtnEraser.onClick       = function() { self.CallFunc( ".Eraser_Func()"         ); }
            self.m_RadioBtnObjectSelect.onClick = function() { self.CallFunc( ".ObjectSelect_Func()"   ); }
            self.m_objRb01.onClick              = function() { self.CallFunc( ".EyedropperTool_Func()" ); }
            self.m_BtnFillSelectedArea.onClick  = function() { self.CallFunc( ".NoCompoundFunc()"      ); }
            self.m_BtnMakeGroup.onClick         = function() { self.CallFunc( ".MakeGroup_Func()"      ); }
            self.m_BtnUndo.onClick              = function() { app.executeMenuCommand("undo"              ); }
            self.m_BtnSimplify.onClick          = function() { app.executeMenuCommand("simplify menu item"); }
            self.m_BtnFitIn.onClick             = function() { app.executeMenuCommand('fitin'             ); }
            self.m_BtnCancel.onClick            = function() { self.close(); }

            // アイテムが選択されているか監視する
            self.m_GrCheckbox.value = true;
            
            // 最後に、新しいインスタンスを追加
            self.RegisterInstance();

            // RegisterInstance()後に実施すべきことを記述
            var StartToolName = cAdobeDirectObjectSelectTool;   // グループ選択
            self.SetAdobeTool(StartToolName);   // 起動時のツールを指定する
        } else {
            alert("Unloaded GUI.");
        }
    }
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
        var self = this.GetGlobalDialog();
    
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
        var self = this.GetGlobalDialog();
    
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
        var self = this.GetGlobalDialog();

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
        var self = this.GetGlobalDialog();

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
        self = this.GetGlobalDialog();

        app.activeDocument.activeView.rotateAngle = 0;
        self.NoSeledtedAngle();
    
        //showStaticGridSwatchDialog();
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

CViewDLg.prototype.MakeGroup_Func = function() {
    try
    {
        self = this.GetGlobalDialog();

        if (app.documents.length > 0) {
            var thePathObj = app.activeDocument.selection;	// 選択中のオブジェクトを取得

            // １つのグループが選択されているかを確認する
            if ( thePathObj[0] == undefined ) {   
                throw new Error("グループを1づだけ選択してね");
            }
            
            if ( ! KindOfItem( thePathObj, cKindOfGroupItem) ) {
                // 選択されているオブジェクトがグループではない場合に、重ね順>最前面へ
                app.executeMenuCommand( "sendToFront" );
            }

            var NewGp = AddGroup( self.m_MkGroupName.text );         // グループ追加
            MoveToGroup( NewGp );                       // 追加したグループ内に、オブジェクトを移動させる
        }

    } // try
    catch(e) {
        alert( e.message );
    } // catch
    finally {
        app.redraw();                               // 再描画させる
    } // finally
}

CViewDLg.prototype.NoSeledtedAngle = function() {
    var self = this.GetGlobalDialog();
    self.m_RadioBtnAngle01.value = false;
    self.m_RadioBtnAngle02.value = false;
    self.m_RadioBtnAngle03.value = false;
}

CViewDLg.prototype.SetAdobeTool = function(TlName) {
    m_ToolName = TlName;
    app.selectTool(m_ToolName);
    var self = this.GetGlobalDialog();
        
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





/**
 * 全スウォッチを横24個のタイルで常時表示するビューアー
 */
function showStaticGridSwatchDialog() {
    if (app.documents.length === 0) return;

    var doc = app.activeDocument;
    var tileSize = 15;   
    var gap = 1;         
    var maxCols = 24;    
    var viewHeight = 600; // 24行程度が表示される高さ

    var win = new Window("dialog", "全スウォッチ・グリッド (固定表示)", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    var mainGrp = win.add("group");
    mainGrp.orientation = "row";
    mainGrp.alignChildren = ["left", "fill"];

    // スクロールエリア（横幅を24個分に固定）
    var scrollArea = mainGrp.add("panel", [0, 0, (tileSize + gap) * maxCols + 40, viewHeight]);
    var innerGrp = scrollArea.add("group");
    innerGrp.orientation = "column";
    innerGrp.alignChildren = ["left", "top"];
    innerGrp.spacing = 10; // グループ間の余白

    // --- データ収集とUI構築 ---
    var groupsData = [];
    
    // 1. 未分類
    var ungrouped = { name: "（未分類）", swatches: [] };
    for (var i = 0; i < doc.swatches.length; i++) {
        var sw = doc.swatches[i];
        if (sw.name === "[None]" || sw.name === "[Registration]") continue;
        if (!isSwInAnyGroup(doc, sw)) ungrouped.swatches.push(sw);
    }
    if (ungrouped.swatches.length > 0) groupsData.push(ungrouped);

    // 2. 各グループ
    for (var g = 0; g < doc.swatchGroups.length; g++) {
        var sg = doc.swatchGroups[g];
        if (sg.name === "") continue;
        groupsData.push({ name: sg.name, swatches: sg.getAllSwatches() });
    }

    // --- メインループ：タイルを配置 ---
    for (var i = 0; i < groupsData.length; i++) {
        var gData = groupsData[i];
        
        // グループ名表示
        var head = innerGrp.add("statictext", undefined, " ■ " + gData.name);
        head.graphics.font = ScriptUI.newFont("Tahoma", "BOLD", 11);

        // タイル格納用（ここでの折り畳み処理は削除）
        var tileContainer = innerGrp.add("group");
        tileContainer.orientation = "column";
        tileContainer.spacing = gap;

        var sws = gData.swatches;
        var rowCount = Math.ceil(sws.length / maxCols);

        for (var r = 0; r < rowCount; r++) {
            var row = tileContainer.add("group");
            row.orientation = "row";
            row.spacing = gap;

            for (var c = 0; c < maxCols; c++) {
                var idx = r * maxCols + c;
                if (idx >= sws.length) break;

                (function() {
                    var targetSw = sws[idx];
                    var chip = row.add("customview", [0, 0, tileSize, tileSize]);
                    
                    chip.myColor = getRGBFromSwatch(targetSw) || [200, 200, 200];
                    chip.swName = targetSw.name;
                    chip.helpTip = targetSw.name;

                    chip.onDraw = function() {
                        var g = this.graphics;
                        var rgb = this.myColor;
                        var brush = g.newBrush(g.BrushType.SOLID_COLOR, [rgb[0]/255, rgb[1]/255, rgb[2]/255, 1]);
                        g.rectPath(0, 0, this.size.width, this.size.height);
                        g.fillPath(brush);
                        g.strokePath(g.newPen(g.PenType.SOLID_COLOR, [0.3, 0.3, 0.3, 1], 1));
                    };

                    chip.addEventListener("mousedown", function() {
                        try {
                            app.activeDocument.defaultFillColor = app.activeDocument.swatches.getByName(this.swName).color;
                            app.redraw();
                        } catch(e) {}
                    });
                })();
            }
        }
    }

    // --- スクロールバー ---
    var sb = mainGrp.add("scrollbar", [0, 0, 20, viewHeight], 0, 0, 10);
    function updateScrollbar() {
        win.layout.layout(true);
        sb.maxvalue = Math.max(0, innerGrp.size.height - viewHeight);
    }
    sb.onChanging = function() { innerGrp.location.y = -this.value; };

    var closeBtn = win.add("button", undefined, "閉じる", {name: "ok"});
    win.onShow = function() { updateScrollbar(); };
    win.show();
}

/** 補助関数（変更なし） **/
function isSwInAnyGroup(doc, sw) {
    for (var i = 0; i < doc.swatchGroups.length; i++) {
        var sg = doc.swatchGroups[i];
        if (sg.name === "") continue;
        var sList = sg.getAllSwatches();
        for (var j = 0; j < sList.length; j++) if (sList[j].name === sw.name) return true;
    }
    return false;
}

function getRGBFromSwatch(sw) {
    var c = sw.color;
    if (c.typename === "SpotColor") c = c.spot.color;
    if (c.typename === "RGBColor") return [c.red, c.green, c.blue];
    if (c.typename === "CMYKColor") {
        return [255*(1-c.cyan/100)*(1-c.black/100), 255*(1-c.magenta/100)*(1-c.black/100), 255*(1-c.yellow/100)*(1-c.black/100)];
    }
    if (c.typename === "GrayColor") { var v = 255 - (c.gray * 2.55); return [v,v,v]; }
    return null;
}






function escExit(event) {
    if(event.keyName === 'Escape'){
        alert( "終わります。" );
        DlgPaint.close();
    }
 }
 

    
// main関数を起動
runMain(main);

function main()
{    
     var appName = app.name;
    // 実行結果の例:
    // "Adobe Illustrator"
    // "Adobe Photoshop"

    // バージョン・チェック
    if ( appName === "Adobe Illustrator" && appVersion()[0]  >= 24 ) {
        // 実行中のスクリプト名を取得（拡張子なし）
        var scriptName = decodeURI(File($.fileName).name).replace(/\.[^\.]+$/, "");

        // 新しいインスタンスを生成
        var Obj  = new CViewDLg() ;
        //Obj.addEventListener( 'keydown',  escExit );     // ESCを監視

        if ( Obj.IsDialg() ) {
            // インデックスをタイトルの先頭に表示
            var Index = Obj.GetGlobalIndex();
            var Title = Obj.GetDialogTitle();
            Obj.SetDialogTitle( "[" + Index + "]" + Title );

            // インスタンスを表示
            Obj.show();
        } else {
            alert( LangStrings.Msg_cant_run );
        }
    } else {
        alert( LangStrings.Msg_Require ); 
    }
}
