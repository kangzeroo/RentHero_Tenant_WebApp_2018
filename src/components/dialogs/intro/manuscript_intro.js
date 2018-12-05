

// Script for the introduction

export const segment = {
  schema: {
    id: '1',
    endpoint: 'end',
  },
  texts: [
    { id: '0-1', textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: 'Hello 👋 My name is RentHero' },
    { id: '0-2', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `I'm an A.I. real estate agent here to help you find your next rental home! Here's what I can do for you:` },
    {
      id: '0-3',
      textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT },
      scrollDown: true,
      component: (
        <div style={{ display: 'flex', flexDirection: 'row', margin: '10px 10px 0px 0px' }}>
          <img src='https://www.daft.ie/blog/wp-content/uploads/2017/09/Video-GIF.gif' height='200px' width='auto' style={{ borderRadius: '20px' }} />
          <h4 style={{ color: 'white' }}>Browse Online Homes</h4>
        </div>
      )
    },
    {
      id: '0-4',
      textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT },
      scrollDown: true,
      component: (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '10px 10px 0px 0px' }}>
          <img src='https://i.giphy.com/media/Yiw4aLjpxldhC/giphy.webp' height='200px' width='auto' style={{ borderRadius: '20px' }} />
          <h4 style={{ color: 'white' }}>Narrow Your Selection</h4>
        </div>
      )
    },
    {
      id: '0-5',
      textStyles: { fontSize: '0.9rem', fontFamily: FONT_FAMILY_ACCENT },
      scrollDown: true,
      component: (
        <div style={{ display: 'flex', flexDirection: 'column', margin: '10px 10px 0px 0px' }}>
          <img src='http://i.imgur.com/0gkRjwu.gif' height='200px' width='auto' style={{ borderRadius: '20px' }} />
          <h4 style={{ color: 'white' }}>Prepare The Paperwork</h4>
        </div>
      )
    },
    { id: '0-6', scrollDown: true, textStyles: { fontSize: '1.2rem', fontFamily: FONT_FAMILY }, text: `It's going to be fun and easy! 😊` },
  ]
}
