import Document, { Head, Main, NextScript } from 'next/document'

class DocumentTemplate extends Document {

  render () {
    return (
      <html>
        <Head>
          <link rel='stylesheet' type='text/css' href='/static/main.css' />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/static/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/favicon/favicon.ico" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="msapplication-config" content="/static/favicon/browserconfig.xml" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,700|Roboto" rel="stylesheet" />
        </body>
      </html>
    )
  }
}

export default DocumentTemplate
