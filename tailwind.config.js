module.exports = {
  content: ['views/*.{html,js,ejs}'],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'] 
      },
      colors:{
      'mint': '#CEE2E4',
      'shadow_mint': 'b9cbcd',
      'white_grad1': 'rgba(255, 255, 255, 0.5)',
      'white_grad2': 'rgba(255, 255, 255, 0)',
      'transparent_white': 'rgba(255, 255, 255, .4)',
      'green_grad1': 'rgba(69, 97, 88, 0.9)',
      'green_grad2': 'rgba(69, 97, 88, .5)',
      'main-green': '456158',
      'playlist-gray':'858585',
      'gray-shadow': '787878'

    },
    backgroundImage: {
      'main-background': "url('/page_background.png')",
      
    },
    },

  },
  plugins: [],
}
