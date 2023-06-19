export default {
    line: {
        "layout": {
            "line-cap": "butt", //One of "butt", "round", "square"
            "line-join": "miter",  //One of "bevel", "round", "miter"
            // "line-miter-limit": 2,
            // "line-round-limit": 1.05,
            "visibility":"visible",
            // "line-sort-key":999
        },
        "paint": {
            "line-blur": 0,
            "line-color":"#000000",
            "line-dasharray": [1],
            "line-gap-width": 0,
            // "line-gradient":"",  //ignore  Requires source to be "geojson".
            "line-offset": 0,
            "line-opacity": 1,
            "line-pattern": '',  //ignore  Optional resolvedImage.
            // "line-pattern": "ae-national-3",  //ignore  Optional resolvedImage.
            "line-translate": [0,0],
            "line-translate-anchor": "map", //One of "map", "viewport".
            "line-width": 1,
        }
    },
    circle:{
        "layout":{
            "visibility":"visible", //One of "visible", "none"
            // "circle-sort-key":999,
        },
        "paint": {
            "circle-blur": 0,
            "circle-color":"#000000",
            "circle-opacity":1,
            "circle-pitch-alignment":"viewport", //One of "map", "viewport"
            "circle-pitch-scale":"map", //One of "map", "viewport"
            "circle-radius":5,
            "circle-stroke-color":"#000000",
            "circle-stroke-opacity":1,
            "circle-stroke-width":0,
            "circle-translate":[0,0],
            "circle-translate-anchor":"map", // One of "map", "viewport"
        }
    },
    fill:{
        "layout":{
            "visibility":"visible", //One of "visible", "none"
            // "fill-sort-key":999
        },
        "paint": {
            "fill-antialias":true,
            "fill-color":"#000000",
            "fill-opacity":1,
            "fill-outline-color":"rgba(255, 255, 255, 1)",
            "fill-pattern": '',  //ignore  Optional resolvedImage.
            // "fill-pattern":"ae-national-3",  //ignore  Optional resolvedImage.
            "fill-translate":[0,0],
            "fill-translate-anchor":"map", // One of "map", "viewport"
        }
    },
    symbol:{
        "layout":{
            "icon-allow-overlap":false,
            "icon-anchor":"center", //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right".
            "icon-ignore-placement":false,
            "icon-image":"",
            "icon-keep-upright":false,
            "icon-offset":[0,0],
            "icon-optional":false,
            "icon-padding":0,
            "icon-pitch-alignment":"auto", //One of "map", "viewport", "auto"
            "icon-rotate":0,
            "icon-rotation-alignment":"auto", //"map", "viewport", "auto"
            "icon-size":1,

            "symbol-placement":"point",  //One of "point", "line", "line-center"
            // "symbol-sort-key":0,
            // "symbol-spacing":1,
            "text-allow-overlap":false,
            "text-anchor":"center", //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right". Defaults to "center"
            "text-field": "",
            "text-font":["Open Sans Regular"],
            "text-ignore-placement":false,
            "text-justify":"center", // One of "auto", "left", "center", "right".
            // "text-keep-upright":true,
            "text-letter-spacing":0,
            "text-line-height":1.2,
            // "text-max-angle":45,
            "text-max-width":0,
            "text-offset":[0,0],
            "text-optional":false,
            "text-padding":2,
            "text-pitch-alignment":"auto", //One of "map", "viewport", "auto"
            // "text-radial-offset":0,
            "text-rotate":0,
            "text-rotation-alignment":"auto", //One of "map", "viewport", "auto"
            "text-size":16,
            "text-transform":"none", //One of "none", "uppercase", "lowercase"
            // "text-variable-anchor":["center"], //One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right".
            // "text-writing-mode":["horizontal"], //One of "horizontal", "vertical"
            "visibility":"visible",
        },
        "paint":{
            // "icon-color":"#000000",
            // // "icon-halo-blur":0,
            // // "icon-halo-color":"rgba(0, 0, 0, 0)",
            // // "icon-halo-width":0,
            "icon-opacity":1,
            "icon-translate":[0,0],
            "icon-translate-anchor":"map", //One of "map", "viewport"
            "text-color":"#000000",
            "text-halo-blur":0,
            "text-halo-color":"rgba(0, 0, 0, 0)",
            "text-halo-width":0,
            "text-opacity":1,
            "text-translate":[0,0],
            // "text-translate-anchor":"map", //One of "map", "viewport".
        }

    },
    "fill-extrusion": {
        "layout": {
          "visibility": "visible", //One of "visible", "none"
          // "fill-extrusion-sort-key":999
        },
        "paint": {
          "fill-extrusion-height": 0,
          "fill-extrusion-base": 0,
          "fill-extrusion-color": "#000000",
          "fill-extrusion-opacity": 1,
          "fill-extrusion-translate": [0, 0],
          "fill-extrusion-translate-anchor": "map", // One of "map", "viewport"
          "fill-extrusion-vertical-gradient": true,
        }          
    },
    background:{
        "paint":{
            "background-color": "#000000",
            "background-opacity": 1,
            // "background-pattern": "",
        },
        "layout":{
            "visibility": "visible",
        }

    },
    heatmap:{
        "paint":{
            "heatmap-color": ["interpolate",["linear"],["heatmap-density"],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"],
            "heatmap-intensity": 1,
            "heatmap-opacity": 1,
            "heatmap-radius": 1,
            "heatmap-weight": 1
        },
        "layout":{
            "visibility": "visible", //One of "visible", "none"
        }
    },    
    tabName: {
        "visibility": "是否可见",
        "circle-color": "颜色",
        "circle-radius": "半径",
        "circle-opacity": "透明度",
        "circle-stroke-color": "边线颜色",
        "circle-stroke-width": "边线宽度",
        "circle-stroke-opacity": "边线不透明度",
        "circle-blur": "模糊",
        "circle-translate": "平移",
        "circle-translate-anchor": "平移参考",
        "circle-pitch-alignment": "倾斜对齐",
        "circle-pitch-scale": "倾斜缩放",
        "line-color": "颜色",
        "line-width": "线宽",
        "line-opacity": "不透明度",
        "line-dasharray": "虚线",
        "line-gap-width": "线间隙",
        "line-blur": "模糊",
        "line-translate": "平移",
        "line-translate-anchor": "平移参考",
        "line-offset": "偏移",
        "line-cap": "线帽",
        "line-join": "线连接",
        "line-miter-limit":"最大斜接长度",
        "line-round-limit":"最小圆角半径",        
        "fill-color": "颜色",
        "fill-opacity": "不透明度",
        "fill-outline-color": "边线颜色",
        "fill-translate": "平移",
        "fill-translate-anchor": "平移参考",
        "fill-antialias": "抗锯齿",
        "fill-extrusion-color": "颜色",
        "fill-extrusion-height": "高度",
        "fill-extrusion-base": "底部高度",
        "fill-extrusion-opacity": "不透明度",
        "fill-extrusion-translate": "平移",
        "fill-extrusion-translate-anchor": "平移参考",
        "fill-extrusion-vertical-gradient": "渐变填充",
        "icon-image": "图标",
        "icon-size": "图标大小",
        "icon-opacity": "不透明度",
        "icon-allow-overlap": "允许压盖",
        "icon-ignore-placement": "忽略放置",
        "icon-optional": "图标可选",
        "icon-padding": "内边距",
        "icon-offset": "偏移",
        "icon-translate": "平移",
        "icon-translate-anchor": "平移参考",
        "icon-anchor": "图标锚点",
        "icon-rotate": "旋转角度",
        "icon-pitch-alignment": "倾斜对齐",
        "icon-rotation-alignment": "旋转对齐",
        "icon-height": "图标高度",
        "text-field": "标注字段",
        "text-color": "颜色",
        "text-opacity": "不透明度",
        "text-font": "字体",
        "text-size": "字体大小",
        "symbol-placement": "放置位置",
        "text-anchor": "标注锚点",
        "text-justify": "文本对齐",
        "text-letter-spacing": "字符间距",
        "text-line-height": "行高",
        "text-max-width": "最大宽度",
        "text-allow-overlap": "允许压盖",
        "text-ignore-placement": "忽略放置",
        "text-optional": "标注可选",
        "text-transform": "大小写转换",
        "text-padding": "内边距",
        "text-offset": "偏移",
        "text-translate": "平移",
        "text-rotate": "旋转角度",
        "text-pitch-alignment": "倾斜角度",
        "text-rotation-alignment": "旋转对齐",
        "text-halo-color": "掩膜颜色",
        "text-halo-width": "掩膜宽度",
        "text-halo-blur": "掩膜模糊",
        "background-color": "背景色",
        "background-opacity": "不透明度",
        "heatmap-opacity": "不透明度",
        "heatmap-radius": "半径",
        "heatmap-weight": "权重",
        "heatmap-intensity": "密度"
      },          

} as any