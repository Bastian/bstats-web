import * as dotenv from "dotenv";
dotenv.config();
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const {PORT, NODE_ENV, API_BASE_URL} = process.env;
const dev = NODE_ENV === 'development';

polka()
    .use(
        compression({threshold: 0}),
        sirv('static', {
            dev,
            setHeaders: (res, pathname, stats) => {
                if (pathname.startsWith("/fonts/")) {
                    // Cache fonts for one year
                    res.setHeader("Cache-Control", "max-age=31536000")
                }
            }
        }),
        sapper.middleware({
            session: () => ({
                API_BASE_URL
            })
        })
    )
    .listen(PORT, err => {
        if (err) console.log('error', err);
    });
