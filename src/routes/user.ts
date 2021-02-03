import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('유저라우터');
});

export default router;
