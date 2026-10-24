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
import Students from './Students.model.js';
import Subjects from './Subjects.model.js';
import Submission from './Submission.model.js';
import Teachers from './Teachers.model.js';
import Terms from './Terms.model.js';
import Users from './Users.model.js';
import ParentStudent from './Parent_Student.model.js';
import Token from './Token.model.js'

/* ---------------- Users ↔ role tables ---------------- */

Users.hasMany(Students, {
  foreignKey: 'user_id',
  as: 'studentProfile',
  onDelete: 'CASCADE',
});
Students.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

Users.hasMany(Teachers, {
  foreignKey: 'user_id',
  as: 'teacherProfile',
  onDelete: 'CASCADE',
});
Teachers.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

Admins.hasMany(Admins, {
  foreignKey: 'user_id',
  as: 'adminProfile',
  onDelete: 'CASCADE',
});
Admins.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

Users.hasMany(Parents, {
  foreignKey: 'user_id',
  as: 'parentProfile',
  onDelete: 'CASCADE',
});
Parents.belongsTo(Users, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
});

Token.belongsTo(Users , {
    foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
})

Users.hasMany(Token,{
    foreignKey: 'user_id',
  as: 'tokens',
  onDelete: 'CASCADE',
})

Terms.belongsTo(AcademicYears, {
  foreignKey: 'academic_year_id',
  as: 'academicYear',
  onDelete: 'CASCADE',
});

AcademicYears.hasMany(Terms, {
  foreignKey: 'academic_year_id',
  as: 'terms',
  onDelete: 'CASCADE',
});

/* ---------------- Parents ↔ Students (M:N) ---------------- */

Parents.belongsToMany(Students, {
  through: ParentStudent,
  foreignKey: 'parent_user_id',
  otherKey: 'student_user_id',
  as: 'children',
});

Students.belongsToMany(Parents, {
  through: ParentStudent,
  foreignKey: 'student_user_id',
  otherKey: 'parent_user_id',
  as: 'parents',
});

/* ---------------- Through-model associations ---------------- */
/* Aliases here are namespaced on ParentStudent only — they MUST match
   the `as:` values used by belongsToMany for `through:` includes to work. */

ParentStudent.belongsTo(Students, {
  foreignKey: 'student_user_id',
  as: 'children',
  onDelete: 'CASCADE',
});

ParentStudent.belongsTo(Parents, {
  foreignKey: 'parent_user_id',
  as: 'parents',
  onDelete: 'CASCADE',
});

/* Reverse (hasMany) — optional, only needed if you query the link table
   directly with includes. Distinct aliases to avoid clashing. */

Students.hasMany(ParentStudent, {
  foreignKey: 'student_user_id',
  as: 'studentParentLinks',
  onDelete: 'CASCADE',
});

Parents.hasMany(ParentStudent, {
  foreignKey: 'parent_user_id',
  as: 'parentStudentLinks',
  onDelete: 'CASCADE',
});

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
  Students,
  Subjects,
  Submission,
  Teachers,
  Terms,
  Users,
  ParentStudent,
  Token
};