import { words_and_hints, words,hints } from '/word-scramble/statics/letters.js';

function main() {
    let num = Math.floor(Math.random() * (words.length - 1)) + 1
    let hint_w = String(words_and_hints[words[num]])
    let word = words[num].toUpperCase()

    let hint = document.getElementById('hint')
    hint.innerHTML = `Hint: ${hint_w}.`

    //Timer.
    let time_elem = document.getElementById('timer')
    function set_timer() {
        let time = parseInt(prompt('How many seconds would you like?: '))
        sessionStorage.setItem('time', time)
        sessionStorage.setItem('time_org', time)
        time_elem.innerHTML = `You have <b>${time}</b> seconds left.`
    }
    
    if (sessionStorage.getItem('time') == undefined || sessionStorage.getItem('time') == NaN || Number(sessionStorage.getItem('time')) <= 0) {
        console.log('Not a number.')
        set_timer()
    } else {
        time_elem.innerHTML = `You have <b>${sessionStorage.getItem('time')}</b> seconds left.`
    }

    let time = parseInt(sessionStorage.getItem('time'))
    function displayTime() {
        time_elem.innerHTML = `You have <b>${time}</b> seconds left.`
        time -= 1
        time_elem.innerHTML = `You have <b>${time}</b> seconds left.`
        if (time == 0) {
            time_elem.innerHTML = `<b>Game over. The answer was ${word}.</b>`
            sessionStorage.setItem('score_n',0)
            score.innerHTML = `Score: ${sessionStorage.getItem('score_n')}`
            //If the time has run out, the buttons will not work anymore.
            submit.onclick = function obselete() {}
            next.onclick = function obselete() {}
            scramble.onclick = function obselete() {}
            clearInterval(time_intervalID)
            //Adds a 'try again?' button.
            let try_again = document.getElementById('try_again')
            try_again.innerHTML = 'try again?'
            try_again.onclick = function reload() {
                location.reload()
                sessionStorage.setItem('score_n',0)
                //Set the timer again.
                set_timer()
            }
        }
        sessionStorage.setItem('time', time)
    }
    let time_intervalID = setInterval(displayTime, 1000)

    //Shuffling.
    function shuffle_word(word) {
        word = ((word.split(' ')).join('_'))
        let shuff_word = [...word]
        shuff_word = shuff_word.sort(() => 0.5 - Math.random());
        shuff_word = shuff_word.join(' ')
        return shuff_word
    }

    //Shuffles the word AND makes sure the shuffled word is SHUFFLED, and not, by coincidence, stayed the same.
    let shuff_word = ''
    while (true) {
        shuff_word = shuffle_word(word)
        if ((shuff_word.split(' ')).join('') != word) {
            break
        } else {
            continue
        }
    }
    shuff_word = shuff_word.split(' ')

    let lst = []
    let w_lst = []

    //Adds the scrambled word to the screen.
    function addElements() {
        let div = document.getElementById('class_holder')
        for (let i = 0; i < shuff_word.length; i++) {
            let new_elem = document.createElement('p')
            let space = document.createElement('p')
            new_elem.innerHTML = shuff_word[i]
            space.innerHTML = 'p'
            space.style.color = 'white'
            lst.push(new_elem)
            w_lst.push(new_elem.innerHTML)
            document.body.appendChild(new_elem)
            document.body.appendChild(space)
            div.appendChild(new_elem)
            div.appendChild(space)
        }
    }
    addElements()

    //Changes color on word when the user types.
    function changeColor() {
        let text = (document.getElementById('text').value).toUpperCase()
        for (let i = 0; i < lst.length; i ++) {
            if ((text.indexOf(lst[i].innerHTML) >= 0) && (lst[i].style.color != '#dbbc4b')) {
                    lst[i].style.color = '#dbbc4b'
                    text = text.substring(0, text.indexOf(lst[i].innerHTML)) + '' + text.substring(text.indexOf(lst[i].innerHTML) + 1);
            } else {
                lst[i].style.color = 'black'
            }
        }
    }
    

    //Buttons and their functionality.
    let submit = document.getElementById('submit')
    let next = document.getElementById('next')
    let check = document.getElementById('check')
    let scramble = document.getElementById('scramble')

    scramble.onclick = function scramble() {
        let copy = [...lst]
        copy.sort(() => 0.5 - Math.random());
        for (let i = 0; i < copy.length; i++) {
            copy[i] = copy[i].innerHTML
        }
        for (let i = 0; i < lst.length; i++) {
            lst[i].innerHTML = copy[i]
        }
    }

    submit.onclick = function submit() {
        if ((text.value).toUpperCase() == word) {
            check.innerHTML = 'That\'s correct!'
        } else {
            check.innerHTML = 'Sorry, that\'s incorrect.'
        }
    }

    //Score tracker.
    let score = document.getElementById('score')
    if (sessionStorage.getItem('score_n') == null) {
        sessionStorage.setItem('score_n',0)
    } else {
        null
    }
    score.innerHTML = `Score: ${sessionStorage.getItem('score_n')}`
    next.onclick = function reload() {
        if ((text.value).toUpperCase() == word) {
            //Updating score.
            sessionStorage.setItem('score_n',parseInt(sessionStorage.getItem('score_n')) + 1 )
            //Reseting time back.
            sessionStorage.setItem('time',parseInt(sessionStorage.getItem('time_org')))
            location.reload()
        } else {
            check.innerHTML = 'Please enter the correct word first.'
        }
    }

    const intervalID = setInterval(changeColor)
}


main()

