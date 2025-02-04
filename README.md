# Defer it 🚦

This is a simple serverless function that defers a request for a given amount of time.

## Usage

<details>
 <summary><code>GET</code> <code><b>/api/v1</b></code></summary>

##### Query Parameters

> | name      | description                  | required? | data type | default | maximum |
> | --------- | ---------------------------- | --------- | --------- | ------- | ------- |
> | `apiKey`  | Contact me                   | yes       | String    | N/A     | N/A     |
> | `url`     | URL to redirect              | yes       | URL       | N/A     | N/A     |
> | `waitFor` | Time to wait before redirect | no        | Integer   | `1000`  | `5000`  |

##### Example URL

- https://defer-it.vercel.app/api/v1?waitFor=3000&url=https://example.com

</details>

## Development

1. Install dependencies

   ```sh
   npm i
   ```

2. Run the development server

   > Requires [Vercel CLI](https://vercel.com/download)

   ```sh
   vercel dev
   ```
