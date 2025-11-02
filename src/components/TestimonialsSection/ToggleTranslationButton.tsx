import type { ReactNode } from 'react';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.scss';

interface ToggleTranslationButtonProps {
    showOriginal: boolean;
    onClick: () => void;
}

export default function ToggleTranslationButton({
    showOriginal,
    onClick
}: ToggleTranslationButtonProps): ReactNode {
    return (
        <button
            className={styles.originalButton}
            onClick={onClick}
        >
            {showOriginal ? (
                <Translate
                    id="testimonials.showTranslation"
                    description="Button to show translation">
                    Show Translation
                </Translate>
            ) : (
                <Translate
                    id="testimonials.showOriginal"
                    description="Button to see original ">
                    Show Original
                </Translate>
            )}
        </button>
    );
}
