// 카테고리 번역 유틸리티 함수들

export const getMainCategoryLabel = (category: string): string => {
  switch (category.toUpperCase()) {
    case 'BACKEND':
      return '백엔드';
    case 'FRONTEND':
      return '프론트엔드';
    case 'CS':
      return 'CS';
    default:
      return category;
  }
};

export const getSubCategoryLabel = (category: string): string => {
  switch (category) {
    case 'SoftwareDevelopment':
      return '소프트웨어 개발';
    case 'SoftwareDesign':
      return '소프트웨어 설계';
    case 'Programming':
      return '프로그래밍';
    case 'Database':
      return '데이터베이스';
    case 'InformationSystemManagement':
      return '정보시스템 관리';
    default:
      return category;
  }
};

// 호환성을 위한 기존 함수 (SubscriptionModal에서 사용)
export const getCategoryLabel = (category: string): string => {
  return getMainCategoryLabel(category);
};