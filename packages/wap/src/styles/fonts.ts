export const importedFonts = {
  GothamBook: require('../../assets/fonts/body/GothamBook.ttf'),
  GothamBookItalic: require('../../assets/fonts/body/GothamBookItalic.ttf'),
  StretchPro: require('../../assets/fonts/heading/StretchPro.otf'),
  TerminaTestBlack: require('../../assets/fonts/subheading/TerminaTestBlack.otf'),
  TerminaTestBold: require('../../assets/fonts/subheading/TerminaTestBold.otf'),
  TerminaTestDemi: require('../../assets/fonts/subheading/TerminaTestDemi.otf'),
  TerminaTestExtraLight: require('../../assets/fonts/subheading/TerminaTestExtraLight.otf'),
  TerminaTestHeavy: require('../../assets/fonts/subheading/TerminaTestHeavy.otf'),
  TerminaTestLight: require('../../assets/fonts/subheading/TerminaTestLight.otf'),
  TerminaTestMedium: require('../../assets/fonts/subheading/TerminaTestMedium.otf'),
  TerminaTestRegular: require('../../assets/fonts/subheading/TerminaTestRegular.otf'),
  TerminaTestThin: require('../../assets/fonts/subheading/TerminaTestThin.otf'),
};

const fontConfig: Record<
  string,
  Record<number, Partial<Record<'normal' | 'italic' | 'bold', keyof typeof importedFonts>>>
> = {
  GothamBook: {
    400: {
      normal: 'GothamBook',
      italic: 'GothamBookItalic',
    },
  },
  TerminaTest: {
    400: {
      normal: 'TerminaTestBlack',
    },
  },
  StretchPro: {
    400: {
      normal: 'StretchPro',
    },
  },
};

const fonts: Record<'heading' | 'body' | 'mono', keyof typeof fontConfig> = {
  heading: 'TerminaTest',
  body: 'GothamBook',
  mono: 'GothamBook',
};

export const themeFontConfig = {
  fontConfig,
  fonts,
};
