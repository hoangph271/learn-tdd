'use strict'
/*eslint-env mocha*/
// * Learn here: https://jrsinclair.com/articles/2016/gentle-introduction-to-javascript-tdd-html-dom/
const { expect } = require('chai')

describe('FlickrFetcher', () => {
  it('should exists', () => {
    expect(require('./flickr-fetcher')).to.be.exist
  })

  const FlickrFetcher = require('./flickr-fetcher')

  describe('#photoObjToURL()', () => {
    it('should take a photo object and return an URL', () => {
      const testCases = [
        {
          input: {
            id: '25373736106',
            owner: '99117316@N03',
            secret: '146731fcb7',
            server: '1669',
            farm: 2,
            title: 'Dog goes to desperate measure to avoid walking on a leash',
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
          },
          expected: 'https://farm2.staticflickr.com/1669/25373736106_146731fcb7_b.jpg',
        },
        {
          input: {
            id: '24765033584',
            owner: '27294864@N02',
            secret: '3c190c104e',
            server: '1514',
            farm: 2,
            title: 'the other cate',
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
          },
          expected: 'https://farm2.staticflickr.com/1514/24765033584_3c190c104e_b.jpg',
        },
        {
          input: {
            id: '24770505034',
            owner: '97248275@N03',
            secret: '31a9986429',
            server: '1577',
            farm: 2,
            title: 'Some pug picture',
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
          },
          expected: 'https://farm2.staticflickr.com/1577/24770505034_31a9986429_b.jpg',
        },
      ]

      testCases.forEach(({ input, expected }) => {
        const actual = FlickrFetcher.photoObjToURL(input)
        expect(actual).to.equal(expected)
      })
    })

    it('should throw an exception if no image object was passed', () => {
      expect(() => {
        FlickrFetcher.photoObjToURL(null)
      }).to.throw("Cannot destructure property `farm` of 'undefined' or 'null'.")
    })
  })

  describe('#transformPhotoObj', () => {
    it('should take a photo object and return an object with just title and URL', () => {
      const testCases = [
        {
          input: {
            id: '25373736106',
            owner: '99117316@N03',
            secret: '146731fcb7',
            server: '1669',
            farm: 2,
            title: 'Dog goes to desperate measure to avoid walking on a leash',
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
          },
          expected: {
            title: 'Dog goes to desperate measure to avoid walking on a leash',
            url:   'https://farm2.staticflickr.com/1669/25373736106_146731fcb7_b.jpg',
          },
        },
        {
          input: {
            id: '24765033584',
            owner: '27294864@N02',
            secret: '3c190c104e',
            server: '1514',
            farm: 2,
            title: 'the other cate',
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
          },
          expected: {
            title: 'the other cate',
            url: 'https://farm2.staticflickr.com/1514/24765033584_3c190c104e_b.jpg',
          },
        },
      ]

      testCases.forEach(({ input, expected }) => {
        const actual = FlickrFetcher.transformPhotoObj(input)
        expect(actual).to.eql(expected)
      })
    })
  })

  describe('#fetchFlickrData()', () => {
    it('should take an API key and fetcher function argument and return a promise for JSON data.', () => {
      const apiKey = 'does not matter much what this is right now'
      const fakeData = {
        'photos': {
          'page': 1,
          'pages': 2872,
          'perpage': 100,
          'total': '287170',
          'photo': [
            {
              'id': '24770505034',
              'owner': '97248275@N03',
              'secret': '31a9986429',
              'server': '1577',
              'farm': 2,
              'title': '20160229090898',
              'ispublic': 1,
              'isfriend': 0,
              'isfamily': 0,
            },
            {
              'id': '24770504484',
              'owner': '97248275@N03',
              'secret': '69dd90d5dd',
              'server': '1451',
              'farm': 2,
              'title': '20160229090903',
              'ispublic': 1,
              'isfriend': 0,
              'isfamily': 0,
            }
          ]
        }
      }

      const fakeFetcher = (url) => {
        const expectedURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=pugs&format=json&nojsoncallback=1`
        expect(url).to.equal(expectedURL)

        return Promise.resolve(fakeData)
      }

      return FlickrFetcher
        .fetchFlickrData({ apiKey, fetcher: fakeFetcher, })
        .then((actual) =>  expect(actual).to.eql(fakeData))
    })
  })

  describe('#fetchPhotos()', () => {
    it('should take an API key and fetcher function, and return a promise for transformed photos', () => {
      const apiKey = 'does not matter what this is right now'
      const fakeFetcher = (url) => {
        const expectedURL = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=pugs&format=json&nojsoncallback=1`
        expect(url).to.equal(expectedURL)

        return Promise.resolve(fakeData)
      }
      const fakeData = {
        'photos': {
          'page': 1,
          'pages': 2872,
          'perpage': 100,
          'total': '287170',
          'photo': [
            {
              id: '25373736106',
              owner: '99117316@N03',
              secret: '146731fcb7',
              server: '1669',
              farm: 2,
              title: 'Dog goes to desperate measure to avoid walking on a leash',
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
            },
            {
              id: '24765033584',
              owner: '27294864@N02',
              secret: '3c190c104e',
              server: '1514',
              farm: 2,
              title: 'the other cate',
              ispublic: 1,
              isfriend: 0,
              isfamily: 0,
            },
          ]
        }
      }
      const expected = [
        {
          title: 'Dog goes to desperate measure to avoid walking on a leash',
          url: 'https://farm2.staticflickr.com/1669/25373736106_146731fcb7_b.jpg',
        },
        {
          title: 'the other cate',
          url: 'https://farm2.staticflickr.com/1514/24765033584_3c190c104e_b.jpg',
        },
      ]

      return FlickrFetcher
        .fetchPhotos({ apiKey, fetcher: fakeFetcher, })
        .then((actual) => expect(actual).to.eql(expected))
    })
  })
})
