

// Script for the introduction
export const segment_1 = {
  schema: {
    id: '1',
    endpoint: '3',
  },
  texts: [
    { id: '0-1', text: 'Hello 👋 My name is RentHero' },
    { id: '0-2', text: `I'm an A.I. real estate agent here to help you find your next rental home! Here's what I can do for you:` },
    { id: '0-3', text: `🔍 Browse Online Homes` },
    { id: '0-4', text: `👆 Narrow Your Selection` },
    { id: '0-5', text: `📜 Prepare The Paperwork` },
    { id: '0-6', text: `Ready to get started? 😊` },
  ],
  segment: 'MessageSegment'
}

export const segment_2 = {
  schema: {
    id: '2',
    endpoint: '3',
  },
  texts: [
    { id: '0-1', text: `Let's get to know each other better. What's your name?` },
  ],
  segment: 'InputSegment'
}

export const segment_3 = {
  schema: {
    id: '3',
    endpoint: '4',
  },
  texts: [
    { id: '0-1', text: `Nice to meet you ${'FIRST_NAME'} 🤝 Where do you commute to most often? I'll find rentals close to it.` },
  ],
  segment: 'MapSegment'
}

export const segment_4 = {
  schema: {
    id: '4',
    endpoint: '5',
  },
  texts: [
    { id: '0-1', text: `What is your primary means of transportation?` },
  ],
  segment: 'MultiOptionsSegment'
}

export const segment_5 = {
  schema: {
    id: '5',
    endpoint: '6',
  },
  texts: [
    { id: '0-1', text: `And how many people are looking for a rental? Just you, or more?` },
  ],
  segment: 'InputSegment'
}

export const segment_6 = {
  schema: {
    id: '6',
    endpoint: '7',
  },
  texts: [
    { id: '0-1', text: `And are you looking to rent an entire place, or just ${`NUMBER`} rooms (possibly with other new roommates)?` },
  ],
  segment: 'MultiOptionsSegment'
}

export const segment_7 = {
  schema: {
    id: '7',
    endpoint: '8',
  },
  texts: [
    { id: '0-1', text: `What is your ideal budget per person?` },
  ],
  segment: 'CounterSegment'
}

export const segment_8 = {
  schema: {
    id: '8',
    endpoint: '9',
  },
  texts: [
    { id: '0-1', text: `Alright, we're going to see a heat map of the average prices around town. Remember that the prices you will see are just averages, and there can be cheaper or more expensive units.` },
  ],
  segment: 'MessageSegment'
}

export const segment_9 = {
  schema: {
    id: '9',
    endpoint: '10',
  },
  texts: [
    { id: '0-1', text: `Explore around the city. There's good deals to be found!` },
    { id: '0-2', text: `When you've explored enough, press the continue button to move on.` },
  ],
  segment: 'HeatMapSegment'
}

export const segment_10 = {
  schema: {
    id: '10',
    endpoint: '11',
  },
  texts: [
    { id: '0-1', text: `Now that you've seen the prices around town, what is your max budget per person?` },
  ],
  segment: 'CounterSegment'
}

export const segment_11 = {
  schema: {
    id: '11',
    endpoint: '12',
  },
  texts: [
    { id: '0-1', text: `Alright, we'll start with this simple search, and later we can get more specific.` },
  ],
  action: `View ${`340`} rentals`,
  segment: 'MessageSegment'
}









export const segment_x = {
  schema: {
    id: 'x',
    endpoint: 'y',
  },
  texts: [
    { id: '0-1', text: 'Hello 👋 My name is RentHero' },
    { id: '0-2', text: `It's going to be fun and easy! 😊` },
  ],
  segment: 'Segment'
}
