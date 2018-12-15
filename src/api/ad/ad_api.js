

export const organizePhotos = (pics) => {
  
  const orderedImages = []
  const outside = pics.filter(p => {
    return p.categories.map(c => c.category).join(', ').indexOf('outside') > -1
  })
  console.log('---- OUTSIDE', outside)
  if (outside.length > 0) {
    orderedImages.push({
      url: outside[0].url,
      caption: 'Welcome to 129 Jane Street'
    })
  }

  const bedroom = pics.filter(p => {
    return p.categories.map(c => c.category).join(', ').indexOf('bedroom') > -1
  })
  console.log('---- BED', bedroom)
  if (bedroom.length > 0) {
    orderedImages.push({
      url: bedroom[0].url,
      caption: '2 Bed 1 Bath'
    })
  }

  const livingRoom = pics.filter(p => {
    return p.categories.map(c => c.category).join(', ').indexOf('livingRoom') > -1
  })
  console.log('---- LIVING', livingRoom)
  if (livingRoom.length > 0) {
    orderedImages.push({
      url: livingRoom[0].url,
      caption: 'And the living room though! Beauty!'
    })
  }

  const kitchen = pics.filter(p => {
    return p.categories.map(c => c.category).join(', ').indexOf('kitchen') > -1
  })
  console.log('---- KITCHEN', kitchen)
  if (kitchen.length > 0) {
    orderedImages.push({
      url: kitchen[0].url,
      caption: 'Modern kitcehn'
    })
  }

  const bathroom = pics.filter(p => {
    return p.categories.map(c => c.category).join(', ').indexOf('bathroom') > -1
  })
  console.log('---- BATH', bathroom)
  if (bathroom.length > 0) {
    orderedImages.push({
      url: bathroom[0].url,
      caption: 'Great bathroom too'
    })
  }


}


export const rankOrderPics = (images) => {
  const sections = {
    outside: [],
    bedroom: [],
    kitchen: [],
    bathroom: [],
    livingRoom: [],
    lobby: [],
    gym: [],
    swimming: [],
    laundry: [],
    floorplan: [],
  }
  const organized = images.map((img) => {
    const tags = img.caption.split(',').map(cap => cap.trim())
    return {
      url: img.url,
      categories: classify(tags, img.url)
    }
  })
  console.log('---------- HERE WE GO ----------')
  console.log(organized)
  return organized
}

const classify = (tags = [], url) => {
  return hints.map((hint) => {
    let count = 0
    hint.hints.forEach((h) => {
      tags.forEach((t) => {
        if (t === h) {
          count += 1
        }
      })
    })
    return {
      category: hint.category,
      count: count
    }
  }).filter((hint) => {
    return hint.count
  })
}

const hints = [
  {
    category: 'outside',
    hints: [
      'condominium',
      'architecture',
      'apartment',
      'building',
      'structure',
      'mixed use',
      'balcony',
    ]
  },
  {
    category: 'bedroom',
    hints: [
      'bed',
      'bedroom',
    ]
  },
  {
    category: 'kitchen',
    hints: [
      'countertop',
      'kitchen',
      'cabinetry',
      'home appliance',
      'kitchen stove',
      'microwave oven',
    ]
  },
  {
    category: 'bathroom',
    hints: [
      'bathroom',
      'toilet',
      'tap',
      'sink',
    ]
  },
  {
    category: 'livingRoom',
    hints: [
      'flooring',
      'living room',
      'ceiling',
      'laminate flooring',
      'wood flooring',
      'hardwood',
      'window'
    ]
  },
  {
    category: 'lobby',
    hints: [
      'lobby',
      'loft',
    ]
  },
  {
    category: 'gym',
    hints: [
      'gym',
      'fitness',
      'leisure',
    ]
  },
  {
    category: 'swimming',
    hints: [
      'swimming pool',
    ]
  },
  {
    category: 'laundry',
    hints: [
      'clothes dryer',
      'laundry room',
      'washing machine',
      'laundry'
    ]
  },
  {
    category: 'floorplan',
    hints: [
      'floor plan',
      'diagram',
    ]
  },
]


/*
    IMAGE DISPLAY FORMAT:
    - bedroom
    - living room
    - kitchen
    - bathroom
    - outside
    - gym
    - rest
*/
