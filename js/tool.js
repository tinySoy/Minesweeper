var random01 = function(n) {
    var r = Math.random()
    r *= 100000
    r = Math.floor(r)
    return r % n
}


var randomLine09 = function(n, x) {
    // 随机成生x个9
    var arr = []
    var temp = []
    for (let i = 0; i < x; i++) {
        let num = random01(n)
        // num [0, n) temp.length = x
        if (temp.includes(num)) {
            i--
            continue
        }
        temp[i] = num
    }
    // log(temp)
    for (let i = 0; i < n; i++) {
        arr[i] = 0
    }
    for (let i = 0; i < temp.length; i++) {
        arr[temp[i]] = 9
    }
    return arr
}

function randomLine(m, n, x) {
    //随机生成 M*N 0 9矩阵 有 x 个 9
    var arr = []
    let temp = randomLine09(m * n, x)
    for (var i = 0; i < n; i++) {
        arr.push(temp.slice(i * m, m * (i + 1)))
        //log('randomLine', `temp = ${temp.slice(i, m*(i+1))}`)
    }
    return arr
}

var clonedSquare = function(array) {
    var s = []
    for (var i = 0; i < array.length; i++) {
        var line = []
        for (var j = 0; j < array[i].length; j++) {
            line.push(array[i][j])
        }
        s.push(line)
    }
    return s
}

// 辅助函数, 给数字 +1
// 这里会判断下标是否合法
var plus1 = function(array, x, y) {
    var n = array.length
    if (x >= 0 && x < n && y >= 0 && y < n) {
        if (array[x][y] !== 9) {
            array[x][y] += 1
        }
    }
}

// 辅助函数, 用来给 9 周边的 8 个格子 +1
var markAround = function(array, x, y) {
    /*
    ###
    #+#
    ###
    */
    if (array[x][y] === 9) {
        // 左边 3 个
        plus1(array, x - 1, y - 1)
        plus1(array, x - 1, y)
        plus1(array, x - 1, y + 1)
        // 上下 2 个
        plus1(array, x, y - 1)
        plus1(array, x, y + 1)
        // 右边 3 个
        plus1(array, x + 1, y - 1)
        plus1(array, x + 1, y)
        plus1(array, x + 1, y + 1)
    }
}

var markedSquare = function(array) {
    var square = clonedSquare(array)
    for (var i = 0; i < square.length; i++) {
        var line = square[i]
        for (var j = 0; j < line.length; j++) {
            markAround(square, i, j)
        }
    }
    return square
}


//alert 样式
var buttonTemplate = function(title, index) {
    var t = `
        <button class='modal-action-button'
                data-index="${index}">${title}</button>
    `
    return t
}

var Actions = function(title, actions, callback) {
    e('#unFind-mines-number').classList.add('hide')
    /*
        这个函数生成一个弹窗页面
        弹窗包含 title 作为标题
        actions 里面的 string 作为标题生成按钮
        弹窗还包含一个 Cancel 按钮
        点击按钮的时候, 调用 callback(index)
    */
    var buttons = []
    for (var i = 0; i < actions.length; i++) {
        var a = actions[i]
        buttons.push(buttonTemplate(a, i))
    }
    var actionButtons = buttons.join('')
    var t = `
    <div class='modal-container modal-remove'>
        <div class='modal-mask'></div>
        <div class="modal-alert vertical-center">
            <div class="modal-title">
                ${title}
            </div>
            <div class="modal-message">
                ${actionButtons}
            </div>
            <div class='modal-control'>
                <button class="modal-button modal-action-button" data-index="-1">Cancel</button>
            </div>
        </div>
    </div>
    `
    appendHtml(e('body'), t)
    // css
    var css = `
    <style class="modal-remove">
        .modal-container {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .modal-mask {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.5;
        }
        .modal-alert {
            margin: 0 auto;
            width: 200px;
            opacity: 1;
        }
        .modal-title {
            text-align: center;
            font-size: 27px;
            background: lightblue;
        }
        .modal-message {
            padding: 10px 5px;
            background: white;
        }
        .modal-input {
            width: 100%;
        }
        .modal-control {
            font-size: 0;
        }
        button {
            width: 100%;
        }
        .modal-button {
            height: 100%;
            font-size: 18px;
            border: 0;
        }
        .vertical-center {
            top: 50%;
            position: relative;
            transform: translateY(-50%);
        }
    </style>
    `
    appendHtml(e('head'), css)
    // event
    bindAll('.modal-action-button', 'click', function(event) {
        //log('click button')
        var index = event.target.dataset.index
        callback(index)
        removeAll('.modal-remove')
    })
}
