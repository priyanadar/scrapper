const axios = require('axios');
const jsdom = require('jsdom');
const {
    JSDOM
} = jsdom;
const {
    Parser
} = require('json2csv');
const fs = require('fs');

async function main() {
    const url = "https://www.imdb.com/search/title/?groups=top_250&sort=user_rating,desc&start=51&ref_=adv_nx";
    const res = await axios.get(url)
    const dom = new JSDOM(res.data);
    const movieEls = dom.window.document.getElementsByClassName('lister-item mode-advanced');
    let movies = [];
    for (movieEl of movieEls) {
        const title = movieEl.getElementsByClassName('lister-item-header')[0].textContent;
        const rating = movieEl.getElementsByClassName('inline-block ratings-imdb-rating')[0].textContent;
        const genre = movieEl.getElementsByClassName('text-muted')[1].textContent;
        movies.push({
            title: title.replace(/\n/g, '').replace(/ /g, ''),
            rating: rating.replace(/\n/g, '').replace(/ /g, ''),
            genre: genre.replace(/\n/g, '').replace(/ /g, ''),
        });
    }
    console.log(movies)
    const parser = new Parser({
        fields: ['title', 'rating', 'genre']
    })
    const csv = parser.parse(movies);
    fs.writeFileSync('./movies1.csv', csv);
}
main()