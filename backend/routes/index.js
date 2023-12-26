// backend/routes/index.js
const express = require('express');
const router = express.Router();
const spotsRoutes = require('./api/spotsRoutes');
const apiRouter = require('./api');

router.use('/api', apiRouter);
router.use('/spots', spotsRoutes);

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });




//Bottom of file -->
module.exports = router;
