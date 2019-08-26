
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'Sorabel Catalog',
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
    ['umi-plugin-firebase', {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "sorabel-catalogs.firebaseapp.com",
      databaseURL: "https://sorabel-catalogs.firebaseio.com",
      projectId: "sorabel-catalogs",
      storageBucket: "sorabel-catalogs.appspot.com",
      messagingSenderId: "327101891213",
      appId: process.env.FIREBASE_APP_ID
    }]
  ],
}
