const Project = require('../models/Project');
const ProjectTask = require('../models/ProjectTask');
const User = require('../models/User');

// Create project (Admin only)
exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    createdBy: req.user.id,
    members: [{ user: req.user.id, role: 'Admin' }]
  });
  res.status(201).json(project);
};

// Add member (Admin only)
exports.addMember = async (req, res) => {
  const { projectId, userId, role } = req.body;
  const project = await Project.findById(projectId);
  const isAdmin = project.members.find(m => m.user.toString() === req.user.id && m.role === 'Admin');
  if (!isAdmin) return res.status(403).json({ msg: 'Only admin can add members' });

  project.members.push({ user: userId, role: role || 'Member' });
  await project.save();
  res.json(project);
};

// Project dashboard
exports.getDashboard = async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members.user').populate('tasks');
  if (!project) return res.status(404).json({ msg: 'Project not found' });

  let totalHours = 0, completedHours = 0;
  for (let task of project.tasks) {
    for (let log of task.timeLogs) {
      const duration = (new Date(log.end) - new Date(log.start)) / 3600000;
      totalHours += duration;
      if (task.status === 'Complete') completedHours += duration;
    }
  }

  const roleStats = {};
  project.members.forEach(m => {
    roleStats[m.role] = (roleStats[m.role] || 0) + 1;
  });

  res.json({
    project: project.name,
    membersCount: project.members.length,
    roleStats,
    totalTasks: project.tasks.length,
    completedTasks: project.tasks.filter(t => t.status === 'Complete').length,
    totalHours,
    completedHours
  });
};
