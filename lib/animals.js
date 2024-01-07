const parseNameAnimal = (page, url) => {
    const animal = {}
    // Parse the ID out of the URL.
    const parsedUrl = new URL(url)
    animal.id = parsedUrl.searchParams.get("id")
    switch(parsedUrl.pathname) {
    case "/namechicken.php":
        animal.type = "chicken"
        break
    case "/namecow.php":
        animal.type = "cow"
        break
    case "/namepig.php":
        animal.type = "pig"
        break
    case "/nameraptor.php":
        animal.type = "raptor"
        break
    default:
        console.debug("unknown animal name page", parsedUrl.pathname)
        break
    }
    // Parse the progress out of the HTML.
    const parser = new DOMParser()
    const dom = parser.parseFromString(page, "text/html")
    animal.progress = dom.querySelector(".progressbar").dataset.progress
    const img = dom.querySelector(".itemimg") || dom.querySelector(".exploreimg")
    animal.image = img.getAttribute("src")
    const name = img.nextElementSibling.nextElementSibling
    animal.pettable = !!name.querySelector("span[style='color:red']")
    return animal
}

const visitNameAnimal = async (state, page, url) => {
    const animal = parseNameAnimal(page, url)
    state.lastView = "nameAnimal"
    state.lastAnimal = animal
}

const parseCoop = (page, url) => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(page, "text/html")
    const coop = {}
    const contentBlocksElms = dom.querySelectorAll('.content-block-title')
    // Egg and feather production
    const aboutElm = contentBlocksElms.item(0).parentElement.querySelector('.card-content-inner')
    coop.eggProd = parseInt(aboutElm.innerText.match(/(\d+) eggs/)[1])
    coop.featherProd = parseInt(aboutElm.innerText.match(/(\d+) feathers/)[1])
    // Chicken count
    coop.chickens = parseInt(contentBlocksElms.item(1).innerText.match(/\d+/)[0])
    return coop
}

const visitCoop = async (state, page, url) => {
    const coop = parseCoop(page, url)
    state.player.coop = coop
    await state.player.save(state.db)
    state.lastView = "coop"
}

const parsePasture = (page, url) => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(page, "text/html")
    const pasture = {}
    const contentBlocksElms = dom.querySelectorAll('.content-block-title')
    // Egg and feather production
    const aboutElm = contentBlocksElms.item(0).parentElement.querySelector('.card-content-inner')
    pasture.milkProd = parseInt(aboutElm.innerText.match(/(\d+) milk/)[1])
    // Chicken count
    pasture.cows = parseInt(contentBlocksElms.item(1).innerText.match(/\d+/)[0])
    return pasture
}

const visitPasture = async (state, page, url) => {
    const pasture = parsePasture(page, url)
    state.player.pasture = pasture
    await state.player.save(state.db)
    state.lastView = "pasture"
}

export const setupAnimals = state => {
    state.addPageHandler("namechicken", visitNameAnimal)
    state.addPageHandler("namecow", visitNameAnimal)
    state.addPageHandler("namepig", visitNameAnimal)
    state.addPageHandler("nameraptor", visitNameAnimal)

    state.addPageHandler("coop", visitCoop)
    state.addPageHandler("pasture", visitPasture)
}
