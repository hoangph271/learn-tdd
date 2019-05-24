const FlickrFetcher = {
  photoObjToURL({ farm, server, id, secret, }) {
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`
  },
  transformPhotoObj({ title, farm, server, id, secret, }) {
    return {
      title,
      url: this.photoObjToURL({ farm, server, id, secret, }),
    }
  },
  async fetchFlickrData({ apiKey, fetcher = fetch}) {
    const url = this._getUrlWithApiKey({ apiKey })

    return fetcher(url)
  },
  async fetchPhotos({ apiKey, fetcher = fetch }) {
    const { photos: { photo: photos = [] } } = await this.fetchFlickrData({ apiKey, fetcher });

    return photos.map((photo) => this.transformPhotoObj(photo))
  },
  _getUrlWithApiKey({ apiKey }) {
    return `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=pugs&format=json&nojsoncallback=1`
  },
}

module.exports = FlickrFetcher
