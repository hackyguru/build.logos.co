import React from 'react'
import Image from '@components/Image'
import Link from '@components/Link'
import Button from '@components/Button'
import { getLinkProps } from '@utils/helpers'
import { MdCheck } from 'react-icons/md'
import cx from 'classnames'
import { DynamicIcon } from 'lucide-react/dynamic'

const getClassName = (className = ' ', first, last) => {
  let classText = className
  if (first) {
    classText = classText + ' first-item'
  }
  if (last) {
    classText = classText + ' last-item'
  }
  return classText
}

const styleToClassName = {
  'body': 'body',
  'bodyLarge': 'body-large',
  'bodyMedium': 'body-medium',
  'bodySmall': 'body-small',
  'bodyTiny': 'body-tiny',
  'trueH1': 'h1',
  'default': 'body',
  'normal': 'body'
}

export const components = {
  block: {
    trueH1: props => <h1 className={getClassName('h1 text-balance', props.node.firstItem, props.node.lastItem)}>{props.children}</h1>,
    h1: props => <h2 className={getClassName('h1 text-balance', props.node.firstItem, props.node.lastItem)}>{props.children}</h2>,
    h2: props => <h2 className={getClassName('h2 text-balance', props.node.firstItem, props.node.lastItem)}>{props.children}</h2>,
    h3: props => <h3 className={getClassName('h3 text-balance', props.node.firstItem, props.node.lastItem)}>{props.children}</h3>,
    h4: props => <h4 className={getClassName('h4', props.node.firstItem, props.node.lastItem)}>{props.children}</h4>,
    h5: props => <h5 className={getClassName('h5', props.node.firstItem, props.node.lastItem)}>{props.children}</h5>,
    li: props => {
      return <li>{props.children}</li>
    },
    blockquote: props => <blockquote className={getClassName('', props.node.firstItem, props.node.lastItem)}>{props.children}</blockquote>,
    bodySmall: props => {
      if (props.listItem) return <strong>{props.children}</strong>
      else return <p className={getClassName('body-small', props.node.firstItem, props.node.lastItem)}>{props.children}</p>
    },
    default: props => <p className={getClassName('body', props.node.firstItem, props.node.lastItem)}>{props.children}</p>,
    normal: props => {
      if (props.listItem) return <strong>{props.children}</strong>
      else return <p className={getClassName('body', props.node.firstItem, props.node.lastItem)}>{props.children}</p>
    },
    bodyMedium: props => {
      if (props.listItem) return <strong>{props.children}</strong>
      else return <p className={getClassName('body-medium', props.node.firstItem, props.node.lastItem)}>{props.children}</p>
    },
    bodyLarge: props => {
      if (props.listItem) return <strong>{props.children}</strong>
      else return <p className={getClassName('body-large', props.node.firstItem, props.node.lastItem)}>{props.children}</p>
    }
  },
  types: {
    inlineImage: ({ value }) => {
      if (!value?.asset) {
        return false
      }
      
      return (
        <div
          style={{
            '--image-max': value.maxWidth ? value.maxWidth + 'px' : '100%',
            '--spacing': value.spacing ? value.spacing + 'px' : 'var(--spacing-gutter)'
          }}
          className={getClassName('inline-block align-top embeded-content max-w-[var(--image-max)]', value.firstItem, value.lastItem)}
        >
          <Image image={value} alt={value?.caption || ''} sizes={value.maxWidth ? value.maxWidth + 'px' : '1000px'}/>
          {value.caption && <figcaption style={{ paddingTop: '.75em' }}>{value.caption}</figcaption>}
        </div>
      )
    },
    tags: ({ value }) => {
      if (!value?.items || value?.items?.length < 1) {
        return false
      }
      
      return (
        <div
          style={{
            '--image-max': value.maxWidth ? value.maxWidth + 'px' : '100%',
            '--spacing': value.spacing ? value.spacing + 'px' : 'var(--spacing-gutter)'
          }}
          className='my-gutter flex flex-wrap gap-[8px]'
        >
          {value.items.map((item, index) => {
            if (!item.title) {
              return false
            }
            return (
              <div
                key={'tag-' + index}
                className='m-0! body sans px-[10px] py-[8px] rounded-button theme-light-grey flex gap-[8px] items-center shrink-0'
              >
                {item.icon && (
                  <div className="shrink-0 text-light-text">
                    <DynamicIcon name={item.icon} size={15} />
                  </div>
                )}
                {item.title}
              </div>
            )
          })}
        </div>
      )
    },
    descriptionList: ({ value }) => {
      if (!value?.listItems || value?.listItems.length === 0) {
        return false
      }
      return <div className={getClassName('description-list', value.firstItem, value.lastItem)}>
        <dl>
          {value.listItems.map(item => (
            <li key={item._key}>
              <dt>{item?.title}</dt>
              <dd>{item?.text}</dd>
            </li>
          ))}
        </dl>
      </div>
    },
    button: ({ value }) => {
      const action = value
      return (
        <Button {...getLinkProps(action)} className={action.theme} key={action._key}>
          {action.title}
        </Button>
      )
    }
  },
  marks: {
    tick: props => (
      <span className='tick'>{props.children}</span>
    ),
    italic: props => (
      <em>{props.children}</em>
    ),
    strong: props => (
      <strong>{props.children}</strong>
    ),
    code: props => (
      <code>{props.children}</code>
    ),
    link: props => {
      const action = props.value
      return (
        <Link
          className='animate-underline underlined'
          {...getLinkProps(action)}
        >{props.children}</Link>
      )
    }
  },
  list: props => {
    const type = props?.value?.listItem
    if (type === 'bullet') {
      return <ul>{props.children}</ul>
    }
    if (type === 'checklist') {
      return <ul className='pl-0 list-none'>{props.children}</ul>
    }
    return <ol>{props.children}</ol>
  },
  listItem: props => {
    const itemType = props?.value?.listItem
    const nodeStyle = props?.children?.props?.node?.style || ''
    const liClassName = styleToClassName[nodeStyle] || nodeStyle
    return (
      <li
        className={cx(liClassName, {
          'checklist-item': itemType === 'checklist'
        })}
      >
        {itemType === 'checklist' && (
          <div className="absolute top-[.05em] left-0">
            <MdCheck size={18} />
          </div>
        )}
        {props.children}
      </li>
    )
  }
}

export default components
