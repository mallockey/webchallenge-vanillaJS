async function fetchData(){
  let data = null

  try{
    data = await fetch("https://eulerity-hackathon.appspot.com/pets")
  }catch(err){
    console.error("There was an error fetching the API.")
    console.error(err)
    const errorContainerEle = document.getElementById("errorContainer")
    errorContainerEle.style.display = "block"
    errorContainerEle.innerText = "Whoops! There was an error retrieving the cute animals, sorry about that."
    return
  }

  data = await data.json()
  data.forEach(item => {
    createPetSubItem(item)
  })

  createBackToTopBtn()
}

fetchData()

async function convertImageToBlob(url){ //Helper function to turn the image from the URL into a blob
  const imageData = await fetch(url)
  return await imageData.blob()
}

function handleSearchChange(event){
  let petItems = document.getElementsByClassName("petSubItem")
  petItemsArr = Array.from(petItems)

  let searchResults = petItemsArr.filter((item) => 
    item.getAttribute("searchTerm").toLowerCase().includes(event.target.value.toLowerCase())
  )

  for(let i = 0; i < petItemsArr.length; i++){
    if(searchResults.includes(petItemsArr[i])){
      petItemsArr[i].style.display = "flex"
    }else{
      petItemsArr[i].style.display = "none"
    }
  }

  let noItemsFound = document.getElementById("noSearchResults")
  if(searchResults.length === 0){
    noItemsFound.style.display = "flex"
  }else{
    noItemsFound.style.display = "none"
  }
}

function createBackToTopBtn(){
  if(document.getElementById("errorContainer").style.display !== 'block'){ //Only add back to top button if there is data
    const backToTopEle = document.createElement("button")
    const divEle = document.createElement("div")
    divEle.className = "backToTopContainer"
    backToTopEle.innerText = "Back to top"
    backToTopEle.className = "backToTopButton"
    backToTopEle.onclick = () => window.scrollTo({top: 0, behavior:'smooth'})
    divEle.appendChild(backToTopEle)
    document.body.appendChild(divEle)
  }
}

function get_url_extension( url ) { //Get the file extension of the URL
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

let imagesToDownload = [] //Array of objects to download

function createPetSubItem(item){
  const petContainerEle = document.getElementById("petsContainer")
  const petSubItemDiv = document.createElement("div")
  petSubItemDiv.className = "petSubItem"
  petSubItemDiv.setAttribute("searchTerm",item.title)

  const titleSpan = document.createElement("span")
  titleSpan.className = "titleSpan"
  titleSpan.innerText = item.title

  const descriptionSpan = document.createElement("span")
  descriptionSpan.innerText = item.description

  const petImageDiv = document.createElement("div")
  petImageDiv.className = "petImageDiv"
  petImageDiv.style.backgroundImage = `url(${item.url})`

  const petImageText = document.createElement("span")
  petImageText.style.display = "none"
  petImageText.innerText = "Click to select"
  petImageText.className = "petImageText"

  petImageDiv.appendChild(petImageText)

  petImageDiv.onmousemove = () => {
    petImageText.style.display = "block"
    petImageDiv.style.opacity = ".6"
  }

  petImageDiv.onmouseleave = () => {
    petImageText.style.display = "none"
    petImageDiv.style.opacity = "1"
  }
  
  petSubItemDiv.appendChild(petImageDiv)
  petSubItemDiv.appendChild(titleSpan)
  petSubItemDiv.appendChild(descriptionSpan)

  const downloadButtonEle = document.getElementById("downloadButton")
  downloadButtonEle.className = "downloadButtonDisabled"

  petImageDiv.onclick = async () => {
    if(petSubItemDiv.className === "petSubItemSelected"){
      petSubItemDiv.className = 'petSubItem'
      petImageText.innerText = "Click to select"
      imagesToDownload = imagesToDownload.filter(downloadObj => downloadObj.url !== item.url) //Remove unselected URL
    }else{
      petSubItemDiv.className = 'petSubItemSelected'
      petImageText.innerText = "Click to unselect"
      imagesToDownload.push({
        title : item.title,
        url : item.url
      }) 
    }
    if(imagesToDownload.length === 0){
      downloadButtonEle.className = "downloadButtonDisabled"
      downloadButtonEle.innerText = "Select images to download"
    }else{
      downloadButtonEle.innerText = `Download ${imagesToDownload.length} images`
      downloadButtonEle.className = "downloadButtonStyle"
      downloadButtonEle.onclick = () => {
        imagesToDownload.forEach(async urlItem => {
          const anchor = document.createElement("a")
          const url = window.URL.createObjectURL(await convertImageToBlob(urlItem.url))
          anchor.href = url
          anchor.download = `${urlItem.title}.${get_url_extension(urlItem.url)}`
          anchor.click()
        })
        let petSubItems = document.getElementsByClassName("petSubItemSelected") //Remove the selections after download
        let tmpArr = Array.from(petSubItems)
        for(let i = 0; i < tmpArr.length; i++){
          tmpArr[i].className = "petSubItem"
        }
      }
    }
  }
  
  petContainerEle.appendChild(petSubItemDiv) 
}
