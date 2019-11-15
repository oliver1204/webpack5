let button = document.createElement('button')
button.innerHTML = "点我试试"

button.addEventListener('click', event => {
  debugger
  import('./hello').then(result => {
    alert(result.default)
  })
})
document.body.appendChild(button)