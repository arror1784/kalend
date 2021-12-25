import { CALENDAR_NAVIGATION_DIRECTION } from '../../common/enums';
import { CalendarDesktopNavigationProps } from './CalendarDesktopNavigation.props';
import { Context } from '../../context/store';
import { DateTime } from 'luxon';
import { EvaIcons } from '../eva-icons';
import {
  getNewCalendarDays,
  navigateToToday,
} from '../../utils/getCalendarDays';
import { parseClassName, parseCssDark } from '../../utils/common';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '../buttonBase/ButtonBase';
import ButtonIcon from '../buttonIcon/ButtonIcon';
import CalendarViewDropdown from '../calendarViewDropdown/CalendarViewDropdown';
import DesktopLayout from '../desktopLayout/DesktopLayout';
import HeaderCalendarButtons from '../headerCalendarButtons/HeaderCalendarButtons';
import HeaderCalendarTitle from '../headerCalendarTitle/HeaderCalendarTitle';
import MobileLayout from '../mobileLayout/MobileLayout';

/**
 * Title with calendar navigation buttons for desktop layout
 * @param props
 * @constructor
 */
const CalendarDesktopNavigation = (props: CalendarDesktopNavigationProps) => {
  const { t } = useTranslation();

  const [store, dispatch] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { config, calendarDays, selectedView, selectedDate, isMobile, width } =
    store;
  const { weekDayStart, isDark } = config;

  const [isFullNavigationHidden, setIsFullNavigationHidden] = useState(true);

  const titleDate = DateTime.fromISO(selectedDate);
  const title = `${t(
    `months:${titleDate.toFormat('MMMM').toLowerCase()}`
  )} ${titleDate.toFormat('yyyy')}`;

  const navigateBackwards = async (): Promise<void> =>
    await getNewCalendarDays(
      calendarDays,
      selectedView,
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      weekDayStart,
      setContext
    );
  const navigateForward = async (): Promise<void> =>
    await getNewCalendarDays(
      calendarDays,
      selectedView,
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      weekDayStart,
      setContext
    );

  const navigateToTodayDate = async (): Promise<void> => {
    await navigateToToday(
      selectedView,
      setContext,
      weekDayStart,
      DateTime.now()
    );
  };

  // handle showing  full desktop navigation panel or dropdown for
  // different screen size
  useEffect(() => {
    const element: any = document.querySelector(
      '.Kalend__CalendarDesktopNavigation__container'
    );

    if (element) {
      if (element) {
        if (element.getBoundingClientRect().width <= 820) {
          setIsFullNavigationHidden(true);
        } else {
          setIsFullNavigationHidden(false);
        }
      }
    }
  }, [width]);

  return (
    <div
      className={parseClassName(
        'Kalend__CalendarDesktopNavigation__container',
        isMobile,
        isDark
      )}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        <DesktopLayout>
          <div className={'Kalend__CalendarDesktopNavigation__buttons'}>
            <>
              <ButtonBase
                className={'Kalend__ButtonBase-border'}
                isDark={isDark}
                onClick={navigateToTodayDate}
              >
                {t('buttons:today')}
              </ButtonBase>
              <ButtonIcon
                isDark={isDark}
                key={'left'}
                onClick={navigateBackwards}
              >
                <EvaIcons.ChevronLeft
                  className={parseCssDark('Kalend__icon-svg', isDark)}
                />
              </ButtonIcon>
              <ButtonIcon
                isDark={isDark}
                key={'right'}
                onClick={navigateForward}
              >
                <EvaIcons.ChevronRight
                  className={parseCssDark('Kalend__icon-svg', isDark)}
                />
              </ButtonIcon>
            </>
          </div>
        </DesktopLayout>
        <HeaderCalendarTitle title={title} />
        <MobileLayout style={{ width: '100%' }}>
          <div className={'Kalend__CalendarDesktopNavigation__buttons'}>
            <>
              <ButtonIcon
                isDark={isDark}
                key={'left'}
                onClick={navigateBackwards}
              >
                <EvaIcons.ChevronLeft
                  className={parseCssDark('Kalend__icon-svg', isDark)}
                />
              </ButtonIcon>
              <ButtonIcon
                isDark={isDark}
                key={'right'}
                onClick={navigateForward}
              >
                <EvaIcons.ChevronRight
                  className={parseCssDark('Kalend__icon-svg', isDark)}
                />
              </ButtonIcon>
              <ButtonIcon
                isDark={isDark}
                key={'calendar'}
                onClick={navigateToTodayDate}
              >
                <EvaIcons.Calendar
                  className={parseCssDark('Kalend__icon-svg', isDark)}
                />
              </ButtonIcon>
              <CalendarViewDropdown
                disabledViews={props.disabledViews}
                setViewChanged={props.setViewChanged}
                disableMobileDropdown={props.disableMobileDropdown}
              />
            </>
          </div>
        </MobileLayout>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginRight: 12,
          justifyContent: 'flex-end',
          flex: 'auto',
        }}
      >
        <DesktopLayout>
          {isFullNavigationHidden ? (
            <CalendarViewDropdown
              disabledViews={props.disabledViews}
              setViewChanged={props.setViewChanged}
              disableMobileDropdown={props.disableMobileDropdown}
            />
          ) : (
            <HeaderCalendarButtons
              disabledViews={props.disabledViews}
              setViewChanged={props.setViewChanged}
            />
          )}
        </DesktopLayout>
      </div>
    </div>
  );
};

export default CalendarDesktopNavigation;
