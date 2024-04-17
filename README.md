# Defer it 🚦

This is a simple serverless function that defers a request for a given amount of time.

## Usage

<details>
 <summary><code>GET</code> <code><b>/api/v1</b></code></summary>

##### Query Parameters

> | name      | type     | data type | default | maximum |
> | --------- | -------- | --------- | ------- | ------- |
> | `waitFor` | optional | Integer   | `1000`  | `5000`  |
> | `url`     | required | URL       | N/A     | N/A     |

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
