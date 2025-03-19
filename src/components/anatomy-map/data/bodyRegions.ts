
import { BodyRegion } from '../types';

export const getBodyRegions = (): BodyRegion[] => [
  {
    id: 'head',
    name: 'Head',
    description: 'Including skull, brain, and facial structures',
    x: 50,
    y: 8
  },
  {
    id: 'neck',
    name: 'Neck',
    description: 'Including cervical spine and neck muscles',
    x: 50,
    y: 13
  },
  {
    id: 'shoulder-right',
    name: 'Right Shoulder',
    description: 'Including rotator cuff and joint',
    x: 35,
    y: 20
  },
  {
    id: 'shoulder-left',
    name: 'Left Shoulder',
    description: 'Including rotator cuff and joint',
    x: 65,
    y: 20
  },
  {
    id: 'arm-upper-right',
    name: 'Upper Right Arm',
    description: 'Including biceps and triceps',
    x: 28,
    y: 30
  },
  {
    id: 'arm-upper-left',
    name: 'Upper Left Arm',
    description: 'Including biceps and triceps',
    x: 72,
    y: 30
  },
  {
    id: 'chest',
    name: 'Chest',
    description: 'Including pectoral muscles and ribcage',
    x: 50,
    y: 25
  },
  {
    id: 'back-upper',
    name: 'Upper Back',
    description: 'Including trapezius and rhomboid muscles',
    x: 50,
    y: 22
  },
  {
    id: 'elbow-right',
    name: 'Right Elbow',
    description: 'Including joint and surrounding tendons',
    x: 25,
    y: 40
  },
  {
    id: 'elbow-left',
    name: 'Left Elbow',
    description: 'Including joint and surrounding tendons',
    x: 75,
    y: 40
  },
  {
    id: 'forearm-right',
    name: 'Right Forearm',
    description: 'Including wrist flexors and extensors',
    x: 22,
    y: 48
  },
  {
    id: 'forearm-left',
    name: 'Left Forearm',
    description: 'Including wrist flexors and extensors',
    x: 78,
    y: 48
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    description: 'Including abdominal muscles and organs',
    x: 50,
    y: 35
  },
  {
    id: 'back-lower',
    name: 'Lower Back',
    description: 'Including lumbar spine and surrounding muscles',
    x: 50,
    y: 40
  },
  {
    id: 'hand-right',
    name: 'Right Hand',
    description: 'Including fingers, palm, and wrist',
    x: 20,
    y: 55
  },
  {
    id: 'hand-left',
    name: 'Left Hand',
    description: 'Including fingers, palm, and wrist',
    x: 80,
    y: 55
  },
  {
    id: 'hip-right',
    name: 'Right Hip',
    description: 'Including hip joint and surrounding muscles',
    x: 42,
    y: 50
  },
  {
    id: 'hip-left',
    name: 'Left Hip',
    description: 'Including hip joint and surrounding muscles',
    x: 58,
    y: 50
  },
  {
    id: 'thigh-right',
    name: 'Right Thigh',
    description: 'Including quadriceps and hamstrings',
    x: 40,
    y: 60
  },
  {
    id: 'thigh-left',
    name: 'Left Thigh',
    description: 'Including quadriceps and hamstrings',
    x: 60,
    y: 60
  },
  {
    id: 'knee-right',
    name: 'Right Knee',
    description: 'Including knee joint, patella, and ligaments',
    x: 38,
    y: 70
  },
  {
    id: 'knee-left',
    name: 'Left Knee',
    description: 'Including knee joint, patella, and ligaments',
    x: 62,
    y: 70
  },
  {
    id: 'leg-lower-right',
    name: 'Lower Right Leg',
    description: 'Including calf muscles and shin',
    x: 37,
    y: 80
  },
  {
    id: 'leg-lower-left',
    name: 'Lower Left Leg',
    description: 'Including calf muscles and shin',
    x: 63,
    y: 80
  },
  {
    id: 'ankle-right',
    name: 'Right Ankle',
    description: 'Including ankle joint and surrounding tendons',
    x: 36,
    y: 90
  },
  {
    id: 'ankle-left',
    name: 'Left Ankle',
    description: 'Including ankle joint and surrounding tendons',
    x: 64,
    y: 90
  },
  {
    id: 'foot-right',
    name: 'Right Foot',
    description: 'Including toes, arch, and heel',
    x: 36,
    y: 95
  },
  {
    id: 'foot-left',
    name: 'Left Foot',
    description: 'Including toes, arch, and heel',
    x: 64,
    y: 95
  }
];
