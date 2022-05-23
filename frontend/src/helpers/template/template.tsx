import React, { FC } from 'react';
import classNames from 'classnames/dedupe';
import { cn } from 'src/helpers/bem';
import { Props } from './props';
import './styles.scss';

const b = cn('bem-block-name');

export const functionTemplate: FC<Props> = (props) => {
    const { className } = props;

    return <div className={classNames(b(), className)}></div>;
};
