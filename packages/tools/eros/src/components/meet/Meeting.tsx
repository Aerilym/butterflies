import { JaaSMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { capitaliseWords } from '../../helper';
import { UserData } from '../authentication/AuthProvider';
import Countdown from '../utility/Countdown';
import { generateJWT, JwtUser } from '../../services/jwt';
import Loading from '../utility/Loading';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvmejOkoFezezY
AhKlH7jGgItXUZPPi7IKU+vc0VdVQqbZ3T9k5RQWpLdi8J/jfF921R5IbHH5jDBC
Y4Bq7na0WUsj8ggcJfWSulWRcJqh02WCthdUHo3CYLm0MmOMxMR5EOx5cZHf6BSM
WY5rjNn4SFSpe2zK6fbGq0o1lyMlOiP1IFynxwO2WKiWbuZB2LLnRGg6ChzoY/J7
zUrx5LLkakRPj2a1WOzi9zRMRJOAH88TLaByzx8JM16mlj2U0ZzSawYjisCTxh6e
FVG3/Cnw4et+kJKiV40Qs12d3p3ug0LuQVY52Pzq0Xp8609o/RjIQSnyaVYWHup9
2cvAOIHpAgMBAAECggEADkwhwG/9SJLLreq9SeSDTuY4ciuaNVPSczTSB3CkA7Uh
kKuK9dQRBqbyp4OgAQ2nWC2SAaOSxBa99ynS0uIHmDeM/qg+MMyGaiPxw52/eV2U
7keVLqwuLp1hgWJ46IU82f6ewmSU0/45bhP8nJUjSivZeNMr0HmsNhDMQgDEQ8uN
TTIMLsOrK1tajxZEuKCeOMePve+310v9RpZSWv+4nzcZxM3etY2U6qeiMxcNPueI
TiGXUYVm5zGZXBnbWAQOl2FOccfbvlFVaF0MadpCN1ALfbaQyw1MjC4aQX0i2JoC
zeqfDF7FvGEU/GRJdr7Bu0uZfCleiFwYZbvv4PkO4QKBgQDuq/ofVJYWy7IP1g8c
n5svVRVlnFJhhMa8tYOG0Ur5rCN6L486h1JqakVN0+5skqt4Q2i1rKT7h7/HWogx
tkiiqV2JeylITVh7FtCXR6gKeJvj66TPMoViwv/CeMHBAk02d0HlIEtGArhshwOQ
ivR9cCrVV1sZ1FS9fFBMmHa9RwKBgQC8Wa8xY1F01Ng1OmKs5q+PZutvWpPCuo4F
rMjC6Z3FjX7HQEIE3fzLxHh634VYJy4j4JDXbzKP5yL2+cP/f2EgwpSxF2H48DYx
EnkUr7h8Rqdh4Fn87i9zJ/YUcqvQv9cVrgGBpuZF6nUaXRasTI9M8uPSgZZbpXQq
nYn+ulOfTwKBgDSb+ABb9tGDiPZwqtgWXnCqgpLpSEdyqxQBtsJK9Ang5dkTDrFK
DuKiFjC3nICWO/HAeh5BtgQzwhRBYnACzDP+vT2GxmzHj89iEgymoOXd/A7bbHK3
oitI7HODhsHyre5pjz7gRXdjNh/GCwUbfBUCWo64OL6SzTMPaevYV6QVAoGBAJ3r
A/yArTcrjety/HDDKccuH4/JfcHy8EjJybnCbcnJDNa6hZ/XD7E5FVrQNdjnYMQr
8MTwMpB81tAEMdTyU9lHy6t/U2GI5abXOjWh7ygjhQuHM2vhuF7wzl3ulyf68Lb4
ocK20LMmFPD5w5zKxAtcSq+gfxRv8KoaVC0CxEH5AoGAQONNmc1kn7JUDGEyBqnu
ebhFhJzNmOVw9OMwauZQiP/Lsc1JFtzrRsMUt5LD7w6CgINdev71k0Clxogq5vf6
jr54ew87MofKRRKHKIa/s7QoRsQCtTWONJ+Ua+uke5+UiW2fBgxbp8382gZuhH+i
GVcY73sACkqs9mm5Zi5M0pE=
-----END PRIVATE KEY-----`;

export default function Meeting({ roomName, user }: { roomName: string; user?: UserData | null }) {
  const [loading, setLoading] = useState(true);
  const [endMeeting, setEndMeeting] = useState(false);
  const [redirectTimeout, setRedirectTimeout] = useState<number | null>(null);
  const [jwt, setJwt] = useState<null | string>(null);
  const redirectTimer = 10000;

  const navigate = useNavigate();

  useEffect(() => {
    const jwtUser: JwtUser = {
      id: user?.id ?? '',
      name: capitaliseWords(user?.preferred_name ?? user?.first_name ?? ''),
      email: user?.email ?? '',
      avatar: user?.avatar_url ?? '',
      appId: 'vpaas-magic-cookie-261bb989ae794c7981c60c3a76ed5008',
      kid: 'vpaas-magic-cookie-261bb989ae794c7981c60c3a76ed5008/b3a00f',
    };

    generateJWT(PRIVATE_KEY, jwtUser).then((jwt) => {
      setJwt(jwt);
      console.log('jwt', jwt);
      setLoading(false);
    });
  }, [user?.avatar_url, user?.email, user?.first_name, user?.id, user?.preferred_name]);

  useEffect(() => {
    if (endMeeting) {
      setRedirectTimeout(
        setTimeout(() => {
          navigate('/meet', { replace: true });
        }, redirectTimer)
      );
    }
    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [endMeeting, navigate, redirectTimeout]);

  const handleRejoinMeeting = () => {
    if (redirectTimeout) {
      clearTimeout(redirectTimeout);
    }
    setEndMeeting(false);
  };

  if (endMeeting) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>
          Thank you for joining the meeting{' '}
          {capitaliseWords(user?.preferred_name ?? user?.first_name ?? '')}!
        </h1>
        <h1>
          You will be redirected to the meeting platform in{' '}
          {<Countdown startingTime={redirectTimer} />}...
        </h1>
        <button
          onClick={handleRejoinMeeting}
          style={{
            padding: '1rem',
            fontSize: '1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            backgroundColor: 'blue',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Rejoin Meeting: {roomName}
        </button>
      </div>
    );
  }

  return loading ? (
    <Loading />
  ) : jwt ? (
    <JaaSMeeting
      appId={'vpaas-magic-cookie-261bb989ae794c7981c60c3a76ed5008'}
      roomName={roomName}
      userInfo={{
        displayName: user?.preferred_name ?? user?.first_name ?? '',
        email: user?.email ?? '',
      }}
      jwt={jwt}
      configOverwrite={{
        disableThirdPartyRequests: true,
        disableLocalVideoFlip: true,
        backgroundAlpha: 0.5,
        startWithAudioMuted: 2,
        useHostPageLocalStorage: true,
        transcribingEnabled: true,
        faceLandmarks: {
          enableFaceCentering: true,
          enableFaceExpressionsDetection: true,
          enableDisplayFaceExpressions: true,
          enableRTCStats: false,
          faceCenteringThreshold: 20,
          captureInterval: 1000,
        },
        lobby: {
          autoKnock: true,
          enableChat: true,
        },
        disableModeratorIndicator: true,
        localRecording: {
          disable: false,
          notifyAllParticipants: true,
        },
        desktopSharingFrameRate: {
          min: 3,
          max: 30,
        },
        screenshotCapture: {
          enabled: true,
          mode: 'always',
        },
      }}
      interfaceConfigOverwrite={{
        VIDEO_LAYOUT_FIT: 'nocrop',
        MOBILE_APP_PROMO: false,
        TILE_VIEW_MAX_COLUMNS: 4,
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = '100vh';
      }}
      onReadyToClose={() => {
        setEndMeeting(true);
      }}
    />
  ) : (
    <div>Unable to generate JWT, tell Ryan</div>
  );
}
