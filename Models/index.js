import AcademicYears from './Academic_Years.model.js';
import Admins from './Admins.model.js';
import Announcement from './Announcement.model.js';
import Assignment from './Assignment.model.js';
import ClassLevels from './Class_Levels.model.js';
import ClassStreams from './Class_Streams.model.js';
import ClassSubjects from './Class_Subjects.model.js';
import Comment from './Comment.model.js';
import DormAssignments from './Dorm_Assignments.model.js';
import DormBeds from './Dorm_Beds.model.js';
import DormRooms from './Dorm_Rooms.model.js';
import Dormitorys from './Dormitorys.model.js';
import DynamicQuestion from './Dynamic_Question.model.js';
import Enrollments from './Enrollments.model.js';
import Feedback from './Feedback.model.js';
import Grade from './Grade.model.js';
import LearningMaterial from './Learning_Material.model.js';
import MaterialView from './Material_View.model.js';
import Parents from './Parents.model.js';
import QuestionResponse from './Question_Response.model.js';
import RubricCriterion from './Rubric_Criterion.model.js';
import RubricScore from './Rubric_Score.model.js';
import Rubric from './Rubric.model.js';
import StudentParents from './student_parents.model.js';
import Students from './Students.model.js';
import Subjects from './Subjects.model.js';
import Submission from './Submission.model.js';
import Teachers from './Teachers.model.js';
import Terms from './Terms.model.js';
import Users from './Users.model.js';

// Relations

// Users has many Students and Students belongs to Users 1:1
Users.hasMany(Students, { foreignKey: 'user_id' , onDelete: 'CASCADE' });
Students.belongsTo(Users, { foreignKey: 'user_id' , onDelete: 'CASCADE' });

// Users has many Teachers and Teachers belongs to Users 1:1
Users.hasMany(Teachers, { foreignKey: 'user_id' , onDelete: 'CASCADE' });
Teachers.belongsTo(Users, { foreignKey: 'user_id' , onDelete: 'CASCADE' });

// Users has many Parents and Parents belongs to Users 1:1
Users.hasMany(Parents, { foreignKey: 'user_id' , onDelete: 'CASCADE' });
Parents.belongsTo(Users, { foreignKey: 'user_id' , onDelete: 'CASCADE' });



export {
  AcademicYears,
  Admins,
  Announcement,
  Assignment,
  ClassLevels,
  ClassStreams,
  ClassSubjects,
  Comment,
  DormAssignments,
  DormBeds,
  DormRooms,
  Dormitorys,
  DynamicQuestion,
  Enrollments,
  Feedback,
  Grade,
  LearningMaterial,
  MaterialView,
  Parents,
  QuestionResponse,
  RubricCriterion,
  RubricScore,
  Rubric,
  StudentParents,
  Students, 
  Subjects,
  Submission, 
  Teachers,
  Terms,
  Users
}
