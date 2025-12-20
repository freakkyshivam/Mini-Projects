import express from 'express'
import {shortUrl,redirectUrl} from '../controllers/urls.controller'
const router = express.Router();

router.post('/shorten', shortUrl)
router.get("/:shortCode",redirectUrl)

export default router;
