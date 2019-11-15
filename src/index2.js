let button = document.createElement('button')
button.innerHTML = "点我试试"

button.addEventListener('click', event => {
  import('./hello.js').then(result => {
    alert(result.default)
  })
})
document.body.appendChild(button)