import { NextResponse } from 'next/server';
import { formatDateToString, getTodayString, isToday, isPastDate, isFutureDate } from '@/lib/utils/dateUtils';

export async function GET() {
  try {
    // Test date utilities
    const testDate = new Date('2025-09-18'); // Today's date
    const testDateString = '2025-09-18';
    
    console.log('🧪 Testing date utilities...');
    
    const todayString = getTodayString();
    const formattedDate = formatDateToString(testDate);
    
    // Test old problematic method
    const oldMethod = testDate.toISOString().split('T')[0];
    
    return NextResponse.json({
      success: true,
      testResults: {
        inputDate: testDate.toString(),
        inputDateString: testDateString,
        currentTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        
        // New methods
        getTodayString: todayString,
        formatDateToString: formattedDate,
        isToday: isToday(testDateString),
        isPastDate: isPastDate('2025-09-17'),
        isFutureDate: isFutureDate('2025-09-19'),
        
        // Old problematic method
        oldToISOMethod: oldMethod,
        
        // Comparison
        datesMatch: formattedDate === todayString,
        oldMethodMatch: oldMethod === todayString,
        
        // Sample dates for testing
        sampleDates: {
          yesterday: '2025-09-17',
          today: todayString,
          tomorrow: '2025-09-19'
        }
      }
    });
  } catch (error) {
    console.error('❌ Test date utilities error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}