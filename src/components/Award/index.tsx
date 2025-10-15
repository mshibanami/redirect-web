import React from 'react';
import styles from './styles.module.css';
import ivyLeafLeading from './award-ivy-leaf-leading.png';

interface AwardProps {
  header: React.ReactNode;
  main: React.ReactNode;
  footer: React.ReactNode;
}

export default function Award({ header, main, footer }: AwardProps): React.ReactNode {
  return (
    <div className={styles.awardContainer}>
      <img
        src={ivyLeafLeading}
        className={styles.ivyLeafLeading}
      />
      <div className={styles.awardContent}>
        <div className={styles.awardHeader}>{header}</div>
        <div className={styles.awardMain}>{main}</div>
        <div className={styles.awardFooter}>{footer}</div>
      </div>
      <img
        src={ivyLeafLeading}
        className={styles.ivyLeafTrailing}
      />
    </div>
  );
}
