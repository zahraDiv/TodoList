////////////////////////////////// Select
const inp = document.querySelector('input[type=text]')
const btnadd = document.querySelector('#add')
const btnsave = document.querySelector('#save')
const container = document.getElementById('container')

const undoBox = document.getElementById('undoBox')
const undoText = document.getElementById('undoText')
const undoBtn = document.getElementById('undoBtn')

const msg = document.getElementById('msg')

const customSelect = document.querySelector('.customSelect')
const filterToggle = document.getElementById('filterToggle')
const filterMenu = document.getElementById('filterMenu')
const filterItems = document.querySelectorAll('.filterItem')
const selectedFilter = document.getElementById('selectedFilter')

const progressBar = document.getElementById('progressBar')
const progressPercent = document.getElementById('progressPercent')



let x
let targget
let targetArticle
let parentArticle
let completedAlert = false
let database = []


let tempLocal = JSON.parse(localStorage.getItem('arts'))


if (tempLocal != undefined) {

    tempLocal.forEach((val) => {

        generateArt(val)

    })

    database = tempLocal

}

function generateArt(temp) {
    const art = document.createElement('article')

   art.dataset.status = temp.status
art.dataset.important = temp.important

    art.innerHTML = `

    <h2>${temp.text}</h2>

    <span class="edit" onclick="myedit(this)">
        <i class="fa-regular fa-pen-to-square"></i>
    </span>

    <span class="important" onclick="myimportant(this)">
        <i class="fa-regular fa-gem"></i>
    </span>

    <span class="doneIcon" onclick="mychange(this)">
        <i class="fa-solid fa-circle-check"></i>
    </span>

    <span class="delete" onclick="mydal(this)">
        <i class="fa-regular fa-trash-can"></i>
    </span>

    `

    if(temp.important == 'yes'){

    art.querySelector('.important i').classList.remove('fa-regular')

    art.querySelector('.important i').classList.add('fa-solid')

    art.querySelector('.important i').classList.add('starOn')

    art.classList.add('importantTask')

}

if(temp.status == 'done'){

    art.querySelector('h2').classList.add('line')

    art.classList.add('doneTask')

}
    container.appendChild(art)
}





function saveData(){

    let cloneDatabase = []


    let articles = document.querySelectorAll('#container article')


    articles.forEach((val)=>{


        let task = {

            text: val.querySelector('h2').innerText,

            status: val.dataset.status,

            important: val.dataset.important

        }


        cloneDatabase.push(task)


    })


    database = cloneDatabase


    localStorage.setItem('arts', JSON.stringify(database))


}


//////////////////////////// Add


btnadd.addEventListener('click', () => {

    let temp = inp.value.trim()

    if (temp == '') {

        alert('Please enter your task!')
        inp.focus()
        return

    }



   let newTask = {

    text: temp,
    status: 'active',
    important: 'no'

}


generateArt(newTask)

database.push(newTask)


    localStorage.setItem('arts', JSON.stringify(database))

    updateProgress()


    inp.value = ''

    inp.focus()

    msg.classList.remove('error')

    msg.innerText = 'Task added successfully!'

    msg.style.display = 'block'

    setTimeout(() => {

        msg.style.display = 'none'

    }, 1000)

})
/////////////////////////////////// Delete


function mydal(s) {

    if (confirm('Are you sure?')) {

        let flag = 5

        targetArticle = s.parentElement
        parentArticle = targetArticle.parentElement

        undoBox.style.display = 'flex'

        undoText.innerText = 'Task deleted - Undo ' + flag

        targetArticle.classList.add('del')

        setTimeout(() => {

            targetArticle.remove()
            saveData()
            updateProgress()

        }, 500)

        x = setInterval(() => {

            if (flag > 0) {

                flag--

                undoText.innerText = 'Task deleted - Undo ' + flag

            } else {

                clearInterval(x)

                undoBox.style.display = 'none'

                msg.classList.add('error')

                msg.innerText = 'Task deleted successfully!'

                msg.style.display = 'block'

                setTimeout(() => {

                    msg.style.display = 'none'

                    msg.classList.remove('error')

                }, 1000)

            }

        }, 1000)

    }

}

//////////////////////////////////////// Undo


undoBtn.addEventListener('click', () => {

    clearInterval(x)

    undoBox.style.display = 'none'

    parentArticle.appendChild(targetArticle)

    targetArticle.classList.remove('del')
    updateProgress()

    msg.classList.remove('error')

    msg.innerText = 'Task restored successfully!'

    msg.style.display = 'block'

    setTimeout(() => {

        msg.style.display = 'none'

    }, 1000)

})
// ////////////////////////////////////Done


function mychange(s) {

    const art = s.parentElement

    art.querySelector('h2').classList.toggle('line')

    art.classList.toggle('doneTask')

    if (art.dataset.status == 'active') {

        art.dataset.status = 'done'

        msg.classList.remove('error')

        msg.innerText = 'Task completed successfully!'

    } else {

        art.dataset.status = 'active'

        msg.classList.remove('error')

        msg.innerText = 'Task marked as active!'

    }

    msg.style.display = 'block'

    setTimeout(() => {

        msg.style.display = 'none'

    }, 1000)

    updateProgress()

    saveData()

}



//////////////////////////////////// Edit


function myedit(s) {

    btnadd.style.display = 'none'

    btnsave.style.display = 'block'

    inp.value = s.parentElement.querySelector('h2').innerText

    inp.focus()

    targget = s

}



////////////////////////////////////// Save


function mysave() {

    if (inp.value.trim() == '') {

        alert('Please enter your task!')

        inp.focus()

        return

    }

    targget.parentElement.querySelector('h2').innerText = inp.value

    saveData()

    btnadd.style.display = 'block'

    btnsave.style.display = 'none'

    inp.value = ''

    inp.focus()

    msg.classList.remove('error')

    msg.innerText = 'Task updated successfully!'

    msg.style.display = 'block'

    setTimeout(() => {

        msg.style.display = 'none'

    }, 1000)

}
///////////////////////////////////////// Dropdown Filter


filterToggle.addEventListener('click', () => {

    customSelect.classList.toggle('active')

})


filterItems.forEach((item) => {

    item.addEventListener('click', function () {

        filterItems.forEach((btn) => {

            btn.classList.remove('active')

        })

        this.classList.add('active')

        selectedFilter.innerHTML = this.innerHTML

        customSelect.classList.remove('active')



        let temp = this.dataset.filter

        let artselect = document.querySelectorAll('#container article')



        artselect.forEach((val) => {

            val.style.display = 'flex'

        })



        if (temp == 'done') {

            artselect.forEach((val) => {

                if (val.dataset.status != 'done') {

                    val.style.display = 'none'

                }

            })

        }

        else if (temp == 'active') {

            artselect.forEach((val) => {

                if (val.dataset.status != 'active') {

                    val.style.display = 'none'

                }

            })

        }

        else if (temp == 'important') {

            artselect.forEach((val) => {

                if (val.dataset.important != 'yes') {

                    val.style.display = 'none'

                }

            })

        }

    })

})




///////////////////////////// Close Dropdown


document.addEventListener('click', function (e) {

    if (!customSelect.contains(e.target)) {

        customSelect.classList.remove('active')

    }

})



////////////////////////////////////// Important


function myimportant(s) {

    const art = s.parentElement

    const icon = s.children[0]

    if (art.dataset.important == 'no') {

        art.dataset.important = 'yes'

        icon.classList.remove('fa-regular')
        icon.classList.add('fa-solid')
        icon.classList.add('starOn')

        art.classList.add('importantTask')

        container.prepend(art)

        msg.classList.remove('error')
        msg.innerText = 'Task marked as important!'

    } else {

        art.dataset.important = 'no'

        icon.classList.remove('fa-solid')
        icon.classList.add('fa-regular')
        icon.classList.remove('starOn')

        art.classList.remove('importantTask')

        msg.classList.remove('error')
        msg.innerText = 'Task removed from important!'

    }

    msg.style.display = 'block'

    setTimeout(() => {

        msg.style.display = 'none'

    }, 1000)
saveData()

}


// <!-- درصد پیشرفت  -->
function updateProgress() {

    const tasks = document.querySelectorAll('#container article')

    const total = tasks.length

    const done = document.querySelectorAll('#container article[data-status="done"]').length


    let percent = 0

    if (total > 0) {

        percent = Math.round((done / total) * 100)

    }


    progressBar.style.width = percent + '%'

    progressPercent.innerText = percent + '%'


    if (percent == 100 && completedAlert == false) {

        alert('🎉 All tasks completed!')

        completedAlert = true

    }


    if (percent < 100) {

        completedAlert = false

    }

}