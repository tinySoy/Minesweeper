//定义唯一全局变量入口

var mineApp = function() {
    this.randomLineArr = []
    //已点击位置的坐标数组
    this.clicked = []
    //游戏时间
    this.startTime = 0
    this.finishTime = 0
    //标记为雷的位置数组
    this.marked = []
    //需要排除地雷的总数
    this.wholeMine = 0
    //地雷id数组
    this.mineMap = []
    //更新剩余地雷书的元素
    this.unfindMinesNumber = e('#unFind-mines-number')
    //当前游戏难度
    this.level
}
//更新剩余地雷数
var upDateUnfindMinesNumber = function() {
    //log("upDateUnfindMinesNumber", `gVar.mineMap = ${gVar.mineMap} gVar.marked = ${gVar.marked}`);
    gVar.unfindMinesNumber.innerHTML = `剩余雷数：${gVar.mineMap.length - gVar.marked.length}个`
}
//判断是否排除所有地雷
var isClear = function() {
    if (gVar === undefined) {
        //log('gVar is undefined');
        return false
    }
    for (var i = 0; i < gVar.marked.length; i++) {
        if (!gVar.mineMap.includes(gVar.marked[i])) {
            //log('isClear', `gVar.mineMap = ${gVar.mineMap} gVar.marked = ${gVar.marked}`);
            return false
        }
    }
    return true
}
//踩中地雷效果
function boom(element) {
    //log('boom');
    toggleClass(element, 'mine9')
    if (!element.classList.contains('uncovered')) {
        element.classList.add('uncovered')
    }
    removeClassAll('covered')
    addClassAll('m9', 'mine9')
    //log(`gVar.marked = ${gVar.marked} gVar.mineMap = ${gVar.mineMap}`);
    let rightMarked = 0
    for (var i = 0; i < gVar.marked.length; i++) {
        if (!gVar.mineMap.includes(gVar.marked[i])) {
            let tempElement = document.getElementById(gVar.marked[i])
            //log('boom tempElement = ', tempElement);
            toggleClass(tempElement, 'mineWrong')
        } else {
            rightMarked++
        }
    }
    gVar.unfindMinesNumber.innerHTML = `剩余雷数：${gVar.mineMap.length - rightMarked}个`
    var myDate = new Date();
    gVar.finishTime = myDate.getTime()
    Actions(`BOOM !!!!
        time : ${(gVar.finishTime - gVar.startTime)/1000}s
        剩余雷数：${gVar.mineMap.length - rightMarked}个`, ['初级', '中级', '高级'], (x) => {
        //log(`x = ${x}`);
        switch (x) {
            case '0':
                let button = e('#id-button-primary')
                //log('button = ', button)
                button.click()
                break;
            case '1':
                e('#id-button-middle').click()
                break;
            case '2':
                e('#id-button-high').click()
                break;
            default:
        }
        //    log(`time : ${(gVar.finishTime - gVar.startTime)/1000}s`);
    })
}
//未踩中雷效果
function commonBoom(element) {
    //log('commonBoom');
    element.innerHTML = element.dataset.value
    if (!element.classList.contains('uncovered')) {
        element.classList.add('uncovered')
    }
    //gVar.clicked.push(element.id)
}
// 如果点击出周围地雷数为0则点亮周围
function showAround(element) {
    let x = element.dataset.locationx
    let y = element.dataset.locationy
    // log('showAround', `x=${x} y=${y}`);
    // log('showAround', `e("#55")=${e("55")}`);
    for (let i = (Number(y) - 1); i <= (Number(y) + 1); i++) {
        for (let j = (Number(x) - 1); j <= (Number(x) + 1); j++) {
            if (i < 10 && i > 0) {
                var tempI = '0' + i.toString()
            } else {
                var tempI = i.toString()
            }
            if (j < 10 && i > 0) {
                var tempJ = '0' + j.toString()
            } else {
                var tempJ = j.toString()
            }
            let tempElement = document.getElementById(tempI + tempJ)
            //log('tempElement = ', tempElement);
            if (tempElement) {
                //    log('showAround', tempElement.id);
                commonBoom(tempElement)
                if (tempElement.dataset.value == 0) {
                    if (!gVar.clicked.includes(tempElement.id)) {
                        tempElement.click()
                    }
                    //    log('showAround', `tempElement.dataset.value = ${tempElement.dataset.value}`);
                }
            }
        }
    }
}

// 右击标记为雷操作
function rightClick() {
    function myRightClick() {
        //log("右击成功！")
        //    log(this.classList)
        if (this.classList.contains('uncovered')) {
            return
        }
        if (this.classList.contains('mineMayBe')) {
            toggleClass(this, 'mineMayBe')
            for (let i = 0; i < gVar.marked.length; i++) {
                if (gVar.marked[i] === this.id) {
                    let temp1 = gVar.marked.slice(0, i)
                    let temp2 = gVar.marked.slice(i + 1)
                    gVar.marked = temp1.concat(temp2)
                    //    log('rightClick gVar.marked = ', gVar.marked);
                }
            }
            upDateUnfindMinesNumber()
        } else {
            toggleClass(this, 'mineMayBe')
            //log(this.id);
            gVar.marked.push(this.id)
            //log('rightClick', `gVar.marked = ${gVar.marked} gVar.wholeMine = ${gVar.wholeMine}`)
            upDateUnfindMinesNumber()
            if (gVar.wholeMine == gVar.marked.length && gVar.wholeMine != 0) {
                if (isClear()) {
                    let myDate = new Date();
                    gVar.finishTime = myDate.getTime()
                    //alert(`mines all clear !!!! time : ${(gVar.finishTime - gVar.startTime)/1000}s`)

                    let time = (gVar.finishTime - gVar.startTime)
                    let bestScore = showMaxScore(time)
                    Actions(`mines all clear !!!!
                        bestscore : ${bestScore / 1000}
                        thistime : ${time / 1000}s`, ['初级', '中级', '高级'], (x) => {
                        //    log(`x = ${x}`);
                        switch (x) {
                            case '0':
                                let button = e('#id-button-primary')
                                //        log('button = ', button)
                                button.click()
                                break;
                            case '1':
                                e('#id-button-middle').click()
                                break;
                            case '2':
                                e('#id-button-high').click()
                                break;
                            default:
                        }
                        //    log(`time : ${(gVar.finishTime - gVar.startTime)/1000}s`);
                    })
                    removeClassAll('covered')
                    addClassAll('m9', 'mine9')
                } else {
                    boom(this)
                    // alert('boom!!!!!!!!!')
                    // removeClassAll('covered')
                    // addClassAll('m9', 'mine9')
                }
            }
        }
        return false
    }
    let mines = eAll(".mine")
    for (var i = 0; i < mines.length; i++) {
        mines[i].oncontextmenu = myRightClick
        //mines[i].bind('contextmenu', myRightClick)
    }
}

// 左键单击操作
function check() {
    //log('check');
    bindAll('.mine', 'click', (event) => {
        //log('check event.target.classList:', event.target.classList);
        if (event.target.classList.contains('mineMayBe')) {
            return
        }
        // log('check', `event.target.innerHTML = ${event.target.innerHTML}`)
        // log('check', `event.target.data.x = ${event.target.dataset.locationx}`)
        // log('check', `event.target.data.y = ${event.target.dataset.locationy}`)
        // log('check', `event.target.data.id = ${event.target.id}`)
        // log('check', `event.target.data.value = ${event.target.dataset.value}`)
        let element = event.target
        let mineValue = event.target.dataset.value
        gVar.clicked.push(element.id)
        switch (mineValue) {
            case '9':
                //log('check-boom');
                boom(element)
                //alert('boom!!!!!!!!!')
                break;
            case '0':
                //log('check-mineValue = 0');
                showAround(element)
                break;
            default:
                //log('check-mineValue = 0 - 9');
                commonBoom(element)
                aroundIsChecked(element)
        }
    })
}

// 如果左键点击后如果四周雷已被排空则点亮周围
var aroundIsChecked = function(element) {
    let x = element.dataset.locationx
    let y = element.dataset.locationy
    //log('aroundIsChecked', `x=${x} y=${y}`);
    let aroundMarkedMines = []
    let aroundMines = []
    let aroundIds = []
    for (let i = (Number(y) - 1); i <= (Number(y) + 1); i++) {
        for (let j = (Number(x) - 1); j <= (Number(x) + 1); j++) {
            if (i < 10 && i > 0) {
                var tempI = '0' + i.toString()
            } else {
                var tempI = i.toString()
            }
            if (j < 10 && i > 0) {
                var tempJ = '0' + j.toString()
            } else {
                var tempJ = j.toString()
            }
            let tempElement = document.getElementById(tempI + tempJ)
            //log('tempElement', tempElement);
            if (tempElement) {
                if (gVar.marked.includes(tempElement.id)) {
                    aroundMarkedMines.push(tempElement.id)
                }
                if (gVar.mineMap.includes(tempElement.id)) {
                    aroundMines.push(tempElement.id)
                }
                aroundIds.push(tempElement.id)
            }
            // if (tempElement) {
            //     log('showAround', tempElement.id);
            //     commonBoom(tempElement)
            //     if (tempElement.dataset.value == 0) {
            //         if (!gVar.clicked.includes(tempElement.id)) {
            //             tempElement.click()
            //         }
            //         log('showAround', `tempElement.dataset.value = ${tempElement.dataset.value}`);
            //     }
            // }
        }
    }
    //log('aroundIsChecked', `aroundIds = ${aroundIds} aroundMarkedMines = ${aroundMarkedMines} aroundMines = ${aroundMines} gVar.mineMap = ${gVar.mineMap}`);
    if (aroundMarkedMines.length === aroundMines.length && aroundMines.length !== 0) {
        for (var i = 0; i < aroundMines.length; i++) {
            if (!gVar.mineMap.includes(aroundMarkedMines[i])) {
                boom(element)
                element.classList.remove('mine9')
                // alert('boom!!!!!')
                // removeClassAll('covered')
                // addClassAll('m9', 'mine9')
                // for (var i = 0; i < gVar.marked.length; i++) {
                //     if (!gVar.mineMap.includes(gVar.marked[i])) {
                //         let tempElement = document.getElementById(gVar.marked[i])
                //         log('boom tempElement = ', tempElement);
                //         toggleClass(tempElement, 'mineWrong')
                //     }
                // }
            }
        }

        for (var i = 0; i < aroundMines.length; i++) {
            if (!aroundMines.includes(aroundMarkedMines[i])) {
                return
            }
        }

        for (var i = 0; i < aroundIds.length; i++) {
            if (!gVar.clicked.includes(aroundIds[i]) && !aroundMines.includes(aroundIds[i])) {
                document.getElementById(aroundIds[i]).click()
            }
        }
    }
}


//生成随机棋盘
function makeRandomLine(buttonId) {
    //log('makeRandomLine', `buttonId = ${buttonId}`);
    let buttonRank = e('#id-button-rank')
    buttonRank.classList.remove('hide')
    switch (buttonId) {
        case "id-button-primary":
            var arr = randomLine(8, 8, 10)
            gVar.wholeMine = 10
            gVar.level = 0
            break;
        case "id-button-middle":
            var arr = randomLine(16, 16, 48)
            gVar.wholeMine = 48
            gVar.level = 1
            break;
        case "id-button-high":
            var arr = randomLine(30, 16, 99)
            gVar.wholeMine = 99
            gVar.level = 2
            break;
        default:
            //log('makeRandomLine false');
            var arr = []
    }
    gVar.randomLineArr = arr
    return markedSquare(arr)
}
//生成棋盘模板
function chessBoardTemplate(arr) {
    var t = ''
    for (var i = 0; i < arr.length; i++) {
        t += `
        <tr class="covered">`
        for (var j = 0; j < arr[i].length; j++) {
            //log('chessBoardTemplate', arr[i][j])
            if (i < 10 && i > 0) {
                var tempI = '0' + i.toString()
            } else {
                var tempI = i.toString()
            }
            if (j < 10 && i > 0) {
                var tempJ = '0' + j.toString()
            } else {
                var tempJ = j.toString()
            }
            //let locationInt = Number(location)
            t += `
            <td id=${tempI}${tempJ} class="mine m${arr[i][j]}" data-locationX=${tempJ} data-locationY=${tempI} data-value=${arr[i][j]}></td>`
        }
        t += `
        </tr>`
    }
    //log('chessBoardTemplate', t);
    return t
}
//插入棋盘模板
function buildLayout(t) {
    let container = e('#id-draw-table')
    removeChildAll('id-draw-table')
    appendHtml(container, t)
}
//按按钮生成棋盘逻辑
function generateLayout() {
    let buttonList = eAll('.level-button')
    for (var i = 0; i < buttonList.length; i++) {
        let button = buttonList[i]
        bindEvent(button, 'click', () => {
            //e('body').classList.add('modal-mask')
            let img = e('.background-image')
            img.classList.add('hide')
            delete gVar
            gVar = new mineApp()
            let myDate = new Date();
            gVar.startTime = myDate.getTime()
            //log('gVar.startTime = ', gVar.startTime);
            let arr = makeRandomLine(button.id)
            //log('generateLayout', arr);
            let t = chessBoardTemplate(arr)
            buildLayout(t)
            check()
            rightClick()
            setTimeout(init, 1000)
        })
    }
}


//初始化地雷坐标数组
function init() {
    let mines = eAll('.m9')
    //log(mines);
    for (var i = 0; i < mines.length; i++) {
        gVar.mineMap.push(mines[i].id)
    }
    //log('gVar.mineMap = ', gVar.mineMap)
    upDateUnfindMinesNumber()
    let buttonList = eAll('.level-button')
    for (var i = 0; i < buttonList.length; i++) {
        if (!buttonList[i].classList.contains("hide")) {
            buttonList[i].classList.add("hide")
        }
    }
    let num = e('#unFind-mines-number')
    if (num.classList.contains("hide")) {
        num.classList.remove("hide")
    }
    let replay = e('#id-button-replay')
    if (replay.classList.contains("hide")) {
        replay.classList.remove("hide")
    }
    //alert('可以开始了！！！！')
}

var bindButtonReplay = function() {
    let button = e('#id-button-replay')
    bindEvent(button, 'click', () => {
        location.replace(location.href)
    })
}

//显示最短用时
var showMaxScore = function(score) {
    let bestScore = getBestScore()
    //log('showMaxScore score = ', score);
    //log('showMaxScore bestScore = ', bestScore);
    switch (gVar.level) {
        case 0:
            //log('case 0');
            if (Number(bestScore[0]) > Number(score)) {
                //log('bestScore[0] > score');
                bestScore[0] = score
                save(bestScore)
            }
            return bestScore[0]
            break;
        case 1:
            if (Number(bestScore[1]) > Number(score)) {
                //log('bestScore[0] > score');
                bestScore[1] = score
                save(bestScore)
            }
            return bestScore[1]
            break;
        case 2:
            if (Number(bestScore[2]) > Number(score)) {
                //log('bestScore[0] > score');
                bestScore[2] = score
                save(bestScore)
            }
            return bestScore[2]
            break;
        default:
            log('showMaxScore error');
    }
}

var getBestScore = function() {
    var time = load()
    return time
}

// 定义一个函数， 用于把 数组 写入 localStorage
var save = function(array) {
    var s = JSON.stringify(array)
    localStorage.bestScore = s
}

// 定义一个函数， 读取 localStorage 中的数据并解析返回
var load = function() {
    if (localStorage.bestScore == undefined) {
        save([1111111111111, 1111111111111, 11111111111111])
    }
    log('localStorage.bestScore:', localStorage.bestScore)
    var s = localStorage.bestScore
    return JSON.parse(s)
    // window.ontouchstart = function(e) {
    //     e.preventDefault();
    // }
}

window.document.oncontextmenu = function() {
    return false;
}

function __main() {
    generateLayout()
    bindButtonReplay()
}

__main()
