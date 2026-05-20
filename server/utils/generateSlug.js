const Submission = require('../models/Submission');

const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const makeSlug = (len = 8) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

exports.generateSlug = async () => {
  let slug, exists;
  do {
    slug  = makeSlug(8);
    exists = await Submission.findOne({ slug });
  } while (exists);
  return slug;
};
