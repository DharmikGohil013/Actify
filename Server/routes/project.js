const router = require('express').Router();
const auth = require('../middlewares/auth');
const projectCtrl = require('../controllers/projectController');

router.use(auth);

router.post('/', projectCtrl.createProject);
router.post('/add-member', projectCtrl.addMember);
router.get('/:id/dashboard', projectCtrl.getDashboard);

module.exports = router;
