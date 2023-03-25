let input = document.querySelector('input');
let dropdown = document.querySelector('.dropdown');

let basket = document.querySelector('.basket');


// создание карточки выбранного репозитория 
function choisRepo(repo){
    let cardRepo = document.createElement('div')
    cardRepo.classList.add('card_repo')
    let repoInfo = document.createElement('div')
    repoInfo.classList.add('repo_info')
    let close = document.createElement('div')
    close.classList.add('close')
    repoInfo.innerText = `name: ${repo.name}
    owner: ${repo.owner.login}
    stars: ${repo.stargazers_count}`
    cardRepo.appendChild(repoInfo)
    cardRepo.appendChild(close)
    basket.appendChild(cardRepo);
    close.addEventListener('click',() =>{
        basket.removeChild(cardRepo) // удаление репозитория 
    })
}
// функция задержка ввода
function debounce(fn, debounceTime){
    let timer;
    return function(){
        let cb = () => {fn.apply(this,arguments)}
        clearTimeout(timer)
        timer = setTimeout(cb,debounceTime)
    }
};
// функция отправуи запроса на сервер 
function serverUp(name){
    // если ввели "пробел" - пробрасывать ошибку
    if(name[0] === ' '){
        return new Promise((resolve, reject) => {
            reject(new Error('Имя репозитория не может начинаться со знака "Пробел"'))
        })
    }
    // если очистили строку
    if(!name) {
        return new Promise((resolve, reject) => {
        resolve([])
    })}
    // запрос на сервер с ведённым запросом 
    return fetch('https://api.github.com/search/repositories?q=' + name + '&per_page=5')
        .then(repos =>{
           return repos.json()
        })
        .then(repos => {
            return arr = [...repos.items]
        })
}
 // добавление карточек в разметку
function dropdownCard(repos){
    dropdown.innerHTML = '';
    let fragment = document.createDocumentFragment();        
    repos.forEach(repo =>{
        let cardName = document.createElement('div');
        cardName.classList.add('card_name');
        cardName.textContent = repo.name
        // выбор репозитория
        cardName.addEventListener('click', ()=>{
            input.value = '';
            dropdown.innerHTML = '';
            choisRepo(repo)
        })
        fragment.appendChild(cardName)
    })
        dropdown.appendChild(fragment)
}
// слушатель отправки запроса
input.addEventListener('keyup', debounce(text =>{
    serverUp(text.target.value)
    .then(repos =>{
        if(repos.length === 0) { //пустой ответ - очистка
            dropdown.innerHTML = '';
        } else { // создание карточек поиска
            dropdownCard(repos)
        }
    })
    .catch(er => { //вывод ошибки ввода
        dropdown.innerHTML = '';
        let error = document.createElement('p');
        error.classList.add('error')
        error.textContent = er
        dropdown.appendChild(error)
    })
},400))
