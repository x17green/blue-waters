/**
 * PDF Manifest Document
 * React PDF component for generating professional passenger manifests
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { ManifestData } from './manifest-generator'

/**
 * PDF Color Palette
 * 
 * NOTE: React-PDF StyleSheet requires literal color values (hex/rgb).
 * CSS variables and Tailwind classes are not supported in PDF rendering.
 * These hex values are mapped from our design tokens for consistency.
 * 
 * Design Token Validation: EXCEPTION - PDF Generation
 */

// PDF-specific color constants (React-PDF requires hex values)
/* eslint-disable design-system/no-hardcoded-colors */
const PDF_TEXT_PRIMARY = '#1a2329'     // bg-800 (darkened for print)
const PDF_TEXT_SECONDARY = '#4e6e80'   // border-default
const PDF_TEXT_MUTED = '#8096a7'       // neutral-600
const PDF_BG_LIGHT = '#f3faff'         // neutral-100
const PDF_BG_SUBTLE = '#e6f6ff'        // neutral-200
const PDF_BORDER_DEFAULT = '#cceaff'   // neutral-300
const PDF_BORDER_DARK = '#1a2329'      // bg-800
const PDF_WARNING_BG = '#fff3cd'       // warning background
const PDF_WARNING_BORDER = '#ffc107'   // warning border
const PDF_WARNING_TEXT = '#856404'     // warning text
/* eslint-enable design-system/no-hardcoded-colors */

// Register fonts (optional - using default fonts)
// Font.register({
//   family: 'Open Sans',
//   src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
// })

const styles = StyleSheet.create({  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: `2 solid ${PDF_BORDER_DARK}`,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: PDF_TEXT_MUTED,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: PDF_TEXT_PRIMARY,
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoItem: {
    width: '50%',
    marginBottom: 5,
    flexDirection: 'row',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoValue: {
    color: PDF_TEXT_SECONDARY,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PDF_BG_SUBTLE,
    padding: 5,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1 solid ${PDF_BORDER_DEFAULT}`,
    padding: 5,
    fontSize: 8,
  },
  tableCell: {
    flex: 1,
  },
  tableCellSmall: {
    width: '15%',
  },
  tableCellLarge: {
    width: '20%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: PDF_TEXT_MUTED,
    fontSize: 8,
    borderTop: `1 solid ${PDF_BORDER_DEFAULT}`,
    paddingTop: 10,
  },
  warningBox: {
    backgroundColor: PDF_WARNING_BG,
    border: `1 solid ${PDF_WARNING_BORDER}`,
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  warningText: {
    fontSize: 9,
    color: PDF_WARNING_TEXT,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: PDF_BG_LIGHT,
    borderRadius: 4,
    minWidth: 100,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PDF_TEXT_PRIMARY,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 8,
    color: PDF_TEXT_MUTED,
    textTransform: 'uppercase',
  },
})

interface ManifestPDFProps {
  data: ManifestData
}

export const ManifestPDF: React.FC<ManifestPDFProps> = ({ data }) => {
  const { tripSchedule, passengers, metadata } = data

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PASSENGER MANIFEST</Text>
          <Text style={styles.subtitle}>
            Yenagoa Boat Club Boat Cruise System - Bayelsa State
          </Text>
        </View>

        {/* Trip Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Trip:</Text>
              <Text style={styles.infoValue}>{tripSchedule.trip.title}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Vessel:</Text>
              <Text style={styles.infoValue}>
                {tripSchedule.trip.vessel.name}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Registration:</Text>
              <Text style={styles.infoValue}>
                {tripSchedule.trip.vessel.registrationNo || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Departure:</Text>
              <Text style={styles.infoValue}>
                {tripSchedule.departurePort || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Arrival:</Text>
              <Text style={styles.infoValue}>
                {tripSchedule.arrivalPort || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Departure Time:</Text>
              <Text style={styles.infoValue}>
                {new Date(tripSchedule.startTime).toLocaleString('en-NG', {
                  timeZone: 'Africa/Lagos',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{metadata.totalPassengers}</Text>
            <Text style={styles.statLabel}>Total Passengers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{metadata.vesselCapacity}</Text>
            <Text style={styles.statLabel}>Vessel Capacity</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {metadata.occupancyRate.toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>Occupancy Rate</Text>
          </View>
        </View>

        {/* Warning if over capacity */}
        {metadata.occupancyRate > 100 && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ WARNING: Passenger count exceeds vessel capacity. This trip
              should not depart until passenger count is reduced.
            </Text>
          </View>
        )}

        {/* Passenger List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger List</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Booking Ref
              </Text>
              <Text style={[styles.tableCell, styles.tableCellLarge]}>
                Full Name
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Phone
              </Text>
              <Text style={[styles.tableCell, styles.tableCellSmall]}>
                Emergency
              </Text>
              <Text style={styles.tableCell}>Special Needs</Text>
            </View>

            {/* Table Rows */}
            {passengers.map((passenger, index) => (
              <View key={passenger.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {passenger.booking.bookingReference || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellLarge]}>
                  {passenger.fullName}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {passenger.phone || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, styles.tableCellSmall]}>
                  {passenger.emergencyContact || 'N/A'}
                </Text>
                <Text style={styles.tableCell}>
                  {passenger.specialNeeds || 'None'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated: {new Date(metadata.generatedAt).toLocaleString('en-NG')}
          </Text>
          <Text>
            This manifest must be carried on board for regulatory compliance.
          </Text>
          <Text>
            Page 1 of 1 | Yenagoa Boat Club Booking System | Ministry of Marine
            Affairs, Bayelsa State
          </Text>
        </View>
      </Page>
    </Document>
  )
}
