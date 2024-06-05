const { nanoid } = require("nanoid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res, next) {
  try {
    const body = req.body;
    console.log(`here is body url`, body);
    if (!body.url) return res.status(400).json({ error: "Url is required" });
    const shortID = nanoid(8);
    const newUrl = await URL.create({
      shortId: shortID,
      redirectUrl: body.url,
      visitHistory: [],
    });
    const savedUrl = await URL.findOne({ shortId: shortID });
    if (savedUrl) {
      return res
        .status(200)
        .json({
          id: savedUrl.shortId,
          url: savedUrl.redirectUrl,
          createdAt: savedUrl.createdAt,
        });
    }else{
      return res.status(500).json({error:"Failed to create short URL"});
    }
  } catch (error) {
    next(error);
  }
}

async function getShortUrl(req, res, next) {
  try {
    const shortId = req.params.shortId;
    console.log(shortId)
    const entry = await URL.findOneAndUpdate(
      { shortId: shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }
    );
    console.log(`Entry after getShortUrl${entry}`);
    if(entry){
      res.status(301).redirect(entry.redirectUrl);
      // res.status(200).json(entry);
    }else{
      res.status(404).json({error:'Short Url is not Found'});
    }
  } catch (error) {
    next(error);
  }
}

async function handleGetAnalytics(req, res, next) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.status(200).json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    next(error);
  }
}
async function deleteShortUrl(req,res,next){
  try{
    const shortId=req.params.shortId;
    console.log(shortId)
    await URL.findOneAndDelete({shortId:shortId});
    return res.status(200).json({
      message:'delete successfully'
    })
  }catch(error){
    next(error)
  }
}

module.exports = {
  handleGenerateNewShortURL,
  getShortUrl,
  handleGetAnalytics,
  deleteShortUrl
};
