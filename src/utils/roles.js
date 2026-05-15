export const ROLES = {
  COMMISSIONER: 'COMMISSIONER',
  DEPT_HEAD: 'DEPT_HEAD',
  ENGINEER: 'ENGINEER'
};

export const ROLE_PERMISSIONS = {
  [ROLES.COMMISSIONER]: ['dashboard', 'create-project', 'engineers', 'tender', 'site-visit', 'documentation', 'schemes', 'technical-sanction', 'administrative-approval'],
  [ROLES.DEPT_HEAD]: ['dashboard','create-project', 'engineers', 'tender', 'documentation', 'schemes', 'technical-sanction', 'administrative-approval'],
  [ROLES.ENGINEER]: ['dashboard', 'site-visit', 'documentation']
};