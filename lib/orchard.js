const parseOrchard = (page, url) => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(page, "text/html")
    const orchard = {}
    const treesElms = dom.querySelectorAll('.col-auto')
    treesElms.forEach(treeElm => {
        const qtyElm = treeElm.querySelector('strong')
        const fruit = qtyElm.nextSibling.nextSibling.textContent.split(' ')[0]
        orchard[fruit] = parseInt(qtyElm.innerText)
    })
    return orchard
}

const visitOrchard = async (state, page, url) => {
    const orchard = parseOrchard(page, url)
    state.player.orchard = orchard
    await state.player.save(state.db)
    state.lastView = "orchard"
}

export const setupOrchard = state => {
    state.addPageHandler("orchard", visitOrchard)
}
