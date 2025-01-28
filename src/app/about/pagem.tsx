'use client'

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import {HeroSection} from '@/components/about/hero-section';
import {CompanyOverview} from '@/components/about/company-overview';
import {MissionVisionSection} from '@/components/about/mission-vision';
import {TeamMembers} from '@/components/about/team-members';
import {GlobalReach} from '@/components/about/global-reach';
import {PressMedia} from '@/components/about/press-media';
import {Careers} from '@/components/about/careers';
import React from 'react';

const tabList = [
    { id: 'overview', label: 'Overview', component: CompanyOverview },
    { id: 'mission', label: 'Mission & Vision', component: MissionVisionSection },
    { id: 'team-members', label: 'Team', component: TeamMembers },
    { id: 'global-reach', label: 'Global Impact', component: GlobalReach },
    { id: 'press-media', label: 'Press', component: PressMedia },
    { id: 'careers', label: 'Careers', component: Careers },
  ];