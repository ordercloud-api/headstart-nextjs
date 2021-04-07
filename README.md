This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Redux

This project uses [react-redux](https://react-redux.js.org/) / [@redux/toolkit](https://redux-toolkit.js.org/) for every interaction with the OrderCloud API. In later releases we plan on elimiating the dependency on **react-redux** in favor of vanilla [redux](https://github.com/reduxjs/redux).

The application follows a general pattern:

- `./redux/REDUCER_NAME/index.ts` - This is where we use `createSlice` to build up the reducer and `asyncThunk` actions. Some folders contain separate action files to help make the code more organized.
- `./lib/useReducerName.ts` - Some reducers come with their own [React Hook](https://reactjs.org/docs/hooks-intro.html) to help make interacting with OrderCloud data easier when developing individual components. Not all hooks are directly related to a single reducer, some use more than one reducer state to accomplish tasks.
- `./components/ComponentName.tsx` - These are the React components that take advantage of our application store through the [useSelector hook](https://react-redux.js.org/api/hooks#useselector). They also might make use of our [custom React hooks](https://reactjs.org/docs/hooks-custom.html) which live inside the `./lib` folder. Some of them dispatch actions that live in the `./redux` folder using the [useDispatch hook](https://react-redux.js.org/api/hooks#usedispatch).

## NextJS and Pages

This project is built in NextJS, meaning that it requires specific files within `./pages` to actually render components. There are a few pages included that utilize the `next/router` to access a query and provide information to a component - which in turn provides information to a hook or action that finally interacts with the OrderCloud API. By separating these concerns, we will eventually be able to extract our React components and Redux logic into installable libraries that can eventually be used in a vanilla React application (sans NextJS).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
