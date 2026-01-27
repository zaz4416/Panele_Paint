
/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":0,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"Dlg","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Paint Suppter","preferredSize":[0,0],"margins":16,"orientation":"row","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Panel","parentId":21,"style":{"enabled":true,"varName":"objPannel01","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Rotate view","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-2":{"id":2,"type":"Group","parentId":1,"style":{"enabled":true,"varName":"objPannel01Group","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-3":{"id":3,"type":"Group","parentId":1,"style":{"enabled":true,"varName":"objPannel02Group","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-4":{"id":4,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"m_BtnResizeDown","text":"↻","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"m_BtnInitRotate","text":"★","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-6":{"id":6,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"m_BtnResizeUp","text":"↺","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-7":{"id":7,"type":"RadioButton","parentId":3,"style":{"enabled":true,"varName":"m_RadioBtnAngle02","text":"↻ 90","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-8":{"id":8,"type":"RadioButton","parentId":3,"style":{"enabled":true,"varName":"m_RadioBtnAngle01","text":"↺ 90","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-9":{"id":9,"type":"RadioButton","parentId":3,"style":{"enabled":true,"varName":"m_RadioBtnAngle03","text":"180","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"Button","parentId":25,"style":{"enabled":true,"varName":"m_BtnUndo","text":"( Undo )","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Button","parentId":25,"style":{"enabled":true,"varName":"m_BtnSimplify","text":"( To simpe path )","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-12":{"id":12,"type":"Panel","parentId":22,"style":{"enabled":true,"varName":"objPannel02","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Tool","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-13":{"id":13,"type":"Checkbox","parentId":27,"style":{"enabled":true,"varName":"m_GrCheckbox","text":"Select layer","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-14":{"id":14,"type":"RadioButton","parentId":27,"style":{"enabled":true,"varName":"m_RadioBtnBlobBrush","text":"BlobBrushC","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-15":{"id":15,"type":"RadioButton","parentId":27,"style":{"enabled":true,"varName":"m_RadioBtnEraser","text":"Eraser","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-16":{"id":16,"type":"RadioButton","parentId":12,"style":{"enabled":true,"varName":"m_RadioBtnObjectSelect","text":"Select Group","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-17":{"id":17,"type":"RadioButton","parentId":12,"style":{"enabled":true,"varName":"m_objRb01","text":"Color picker","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-18":{"id":18,"type":"Button","parentId":25,"style":{"enabled":true,"varName":"m_BtnFitIn","text":"( View the whole )","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-19":{"id":19,"type":"Button","parentId":25,"style":{"enabled":true,"varName":"m_BtnFillSelectedArea","text":"(Fill selected items )","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-20":{"id":20,"type":"Button","parentId":23,"style":{"enabled":true,"varName":"m_BtnCancel","text":"Close","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-21":{"id":21,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-22":{"id":22,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-23":{"id":23,"type":"Group","parentId":22,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["center","center"],"alignment":null}},"item-25":{"id":25,"type":"Group","parentId":21,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-27":{"id":27,"type":"Panel","parentId":12,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}}},"order":[0,21,1,2,4,5,6,3,7,8,9,25,11,10,18,19,22,12,27,13,14,15,16,17,23,20],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":false,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 

// DLG
// ===
var Dlg = new Window("dialog"); 
    Dlg.text = "Paint Suppter"; 
    Dlg.orientation = "row"; 
    Dlg.alignChildren = ["center","top"]; 
    Dlg.spacing = 10; 
    Dlg.margins = 16; 

// GROUP1
// ======
var group1 = Dlg.add("group", undefined, {name: "group1"}); 
    group1.orientation = "column"; 
    group1.alignChildren = ["left","center"]; 
    group1.spacing = 10; 
    group1.margins = 0; 

// OBJPANNEL01
// ===========
var objPannel01 = group1.add("panel", undefined, undefined, {name: "objPannel01"}); 
    objPannel01.text = "Rotate view"; 
    objPannel01.orientation = "column"; 
    objPannel01.alignChildren = ["left","top"]; 
    objPannel01.spacing = 10; 
    objPannel01.margins = 10; 

// OBJPANNEL01GROUP
// ================
var objPannel01Group = objPannel01.add("group", undefined, {name: "objPannel01Group"}); 
    objPannel01Group.orientation = "row"; 
    objPannel01Group.alignChildren = ["left","center"]; 
    objPannel01Group.spacing = 10; 
    objPannel01Group.margins = 0; 

var m_BtnResizeDown = objPannel01Group.add("button", undefined, undefined, {name: "m_BtnResizeDown"}); 
    m_BtnResizeDown.text = "↻"; 

var m_BtnInitRotate = objPannel01Group.add("button", undefined, undefined, {name: "m_BtnInitRotate"}); 
    m_BtnInitRotate.text = "★"; 

var m_BtnResizeUp = objPannel01Group.add("button", undefined, undefined, {name: "m_BtnResizeUp"}); 
    m_BtnResizeUp.text = "↺"; 

// OBJPANNEL02GROUP
// ================
var objPannel02Group = objPannel01.add("group", undefined, {name: "objPannel02Group"}); 
    objPannel02Group.orientation = "row"; 
    objPannel02Group.alignChildren = ["left","center"]; 
    objPannel02Group.spacing = 10; 
    objPannel02Group.margins = 0; 

var m_RadioBtnAngle02 = objPannel02Group.add("radiobutton", undefined, undefined, {name: "m_RadioBtnAngle02"}); 
    m_RadioBtnAngle02.text = "↻ 90"; 

var m_RadioBtnAngle01 = objPannel02Group.add("radiobutton", undefined, undefined, {name: "m_RadioBtnAngle01"}); 
    m_RadioBtnAngle01.text = "↺ 90"; 

var m_RadioBtnAngle03 = objPannel02Group.add("radiobutton", undefined, undefined, {name: "m_RadioBtnAngle03"}); 
    m_RadioBtnAngle03.text = "180"; 

// GROUP2
// ======
var group2 = group1.add("group", undefined, {name: "group2"}); 
    group2.orientation = "column"; 
    group2.alignChildren = ["left","center"]; 
    group2.spacing = 10; 
    group2.margins = 0; 

var m_BtnSimplify = group2.add("button", undefined, undefined, {name: "m_BtnSimplify"}); 
    m_BtnSimplify.text = "( To simpe path )"; 

var m_BtnUndo = group2.add("button", undefined, undefined, {name: "m_BtnUndo"}); 
    m_BtnUndo.text = "( Undo )"; 

var m_BtnFitIn = group2.add("button", undefined, undefined, {name: "m_BtnFitIn"}); 
    m_BtnFitIn.text = "( View the whole )"; 

var m_BtnFillSelectedArea = group2.add("button", undefined, undefined, {name: "m_BtnFillSelectedArea"}); 
    m_BtnFillSelectedArea.text = "(Fill selected items )"; 

// GROUP3
// ======
var group3 = Dlg.add("group", undefined, {name: "group3"}); 
    group3.orientation = "column"; 
    group3.alignChildren = ["left","center"]; 
    group3.spacing = 10; 
    group3.margins = 0; 

// OBJPANNEL02
// ===========
var objPannel02 = group3.add("panel", undefined, undefined, {name: "objPannel02"}); 
    objPannel02.text = "Tool"; 
    objPannel02.orientation = "column"; 
    objPannel02.alignChildren = ["left","top"]; 
    objPannel02.spacing = 10; 
    objPannel02.margins = 10; 

// PANEL1
// ======
var panel1 = objPannel02.add("panel", undefined, undefined, {name: "panel1"}); 
    panel1.orientation = "column"; 
    panel1.alignChildren = ["left","top"]; 
    panel1.spacing = 10; 
    panel1.margins = 10; 

var m_GrCheckbox = panel1.add("checkbox", undefined, undefined, {name: "m_GrCheckbox"}); 
    m_GrCheckbox.text = "Select layer"; 

var m_RadioBtnBlobBrush = panel1.add("radiobutton", undefined, undefined, {name: "m_RadioBtnBlobBrush"}); 
    m_RadioBtnBlobBrush.text = "BlobBrushC"; 

var m_RadioBtnEraser = panel1.add("radiobutton", undefined, undefined, {name: "m_RadioBtnEraser"}); 
    m_RadioBtnEraser.text = "Eraser"; 

// OBJPANNEL02
// ===========
var m_RadioBtnObjectSelect = objPannel02.add("radiobutton", undefined, undefined, {name: "m_RadioBtnObjectSelect"}); 
    m_RadioBtnObjectSelect.text = "Select Group"; 

var m_objRb01 = objPannel02.add("radiobutton", undefined, undefined, {name: "m_objRb01"}); 
    m_objRb01.text = "Color picker"; 

// GROUP4
// ======
var group4 = group3.add("group", undefined, {name: "group4"}); 
    group4.orientation = "column"; 
    group4.alignChildren = ["center","center"]; 
    group4.spacing = 10; 
    group4.margins = 0; 

var m_BtnCancel = group4.add("button", undefined, undefined, {name: "m_BtnCancel"}); 
    m_BtnCancel.text = "Close"; 

