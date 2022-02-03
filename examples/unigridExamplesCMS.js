export const CONFIG = [
  {
    type: 'Page',
    url: '/test',
    name: 'TestPage',
    layout: {
      component: 'BasicLayout',
      children: [
        'Header',
        'Main',
        'Footer'
      ]
    },
  },
  {
    type: 'Page',
    url: '/new/',
    name: 'TestPage1',
    layout: {
      component: 'Layout',
      children: [
        'Header',
        {
          component: 'Chain',
          children: [
            'Table',
            'Article'
          ]
        },
        'UnigridA',
        'Footer'
      ]
    }
  }
];
