import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import axios from './../../utils/axios';
import { Debug } from './../../utils/logger';

import { AppSetLoading } from './../../store/actions/app.action';
import { UserFetchData } from './../../store/actions/user.action';
import ErrorList from '../../components/ErrorList';
import {
    GenerateEpisodeMeta,
    applyEpisodeTemplate,
    DurationSecondToText,
    urlHasEpisodeDotFilename,
} from '../../utils/movies';

const PLACEHOLDER_RE = /\{(?:nnn|nn|n)\}/;

function isValidHttpUrl(string) {
    try {
        const u = new URL(string);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
        return false;
    }
}

function AddBatchEpisode(props) {
    const { movieId } = useParams();

    const history = useHistory();
    const dispatch = useDispatch();

    const moviesList = useSelector(state => state.movies.list);
    const userToken = useSelector(state => state.user.user.token);

    const movie = moviesList[movieId];

    const generatedData = useMemo(() => GenerateEpisodeMeta(movie?.episodes || null), [movie?.episodes]);

    const [startEpisodeId, setStartEpisodeId] = useState(String(generatedData.id));
    const [episodeCount, setEpisodeCount] = useState(24);
    const [urlTemplate, setUrlTemplate] = useState('');
    const [titleTemplate, setTitleTemplate] = useState(
        () => `Tập {nn} [${generatedData.resolution || '720p'}]`
    );
    const [duration, setDuration] = useState(0);
    const [status, setStatus] = useState(0);

    const [previewRows, setPreviewRows] = useState(null);
    const [previewErrors, setPreviewErrors] = useState([]);
    const [errors, setErrors] = useState([]);

    const onClickBack = (e) => {
        e.preventDefault();
        history.push(`/my-movies/${movieId}/edit`);
    };

    const buildPreview = useCallback(
        (e) => {
            e.preventDefault();
            setPreviewErrors([]);
            setErrors([]);

            const startId = parseInt(String(startEpisodeId).trim(), 10);
            const count = parseInt(String(episodeCount).trim(), 10);

            const problems = [];

            if (!Number.isFinite(startId) || startId < 1 || startId > 999) {
                problems.push({ message: 'Starting episode ID must be between 1 and 999.' });
            }
            if (!Number.isFinite(count) || count < 1 || count > 99) {
                problems.push({ message: 'Episode count must be between 1 and 99.' });
            }
            if (Number.isFinite(startId) && Number.isFinite(count) && startId + count - 1 > 999) {
                problems.push({
                    message: `Last episode ID would be ${startId + count - 1}; IDs must stay ≤ 999.`,
                });
            }

            const urlTrim = urlTemplate.trim();
            const titleTrim = titleTemplate.trim();

            if (!urlTrim) {
                problems.push({ message: 'URL template is required.' });
            } else if (!PLACEHOLDER_RE.test(urlTrim) && !urlHasEpisodeDotFilename(urlTrim)) {
                problems.push({
                    message:
                        'URL template must include {n}, {nn}, or {nnn}, or end with an episode file like .../01.mp4 (digits before the dot).',
                });
            }

            if (!titleTrim) {
                problems.push({ message: 'Title template is required.' });
            }

            const dur = Number(duration);
            if (!Number.isFinite(dur) || dur < 0 || dur > 99999) {
                problems.push({ message: 'Duration must be between 0 and 99999 seconds.' });
            }

            if (problems.length) {
                setPreviewErrors(problems);
                setPreviewRows(null);
                return;
            }

            const rows = [];
            const conflicts = [];

            for (let i = 0; i < count; i++) {
                const epNum = startId + i;
                const epKey = `ep${epNum}`;
                const url = applyEpisodeTemplate(urlTrim, epNum);
                let title = applyEpisodeTemplate(titleTrim, epNum);

                if (title.length > 64) {
                    problems.push({
                        message: `Generated title for episode ${epNum} exceeds 64 characters. Shorten the title template.`,
                    });
                    setPreviewErrors(problems);
                    setPreviewRows(null);
                    return;
                }
                if (title.length < 1) {
                    problems.push({ message: `Generated title for episode ${epNum} is empty.` });
                    setPreviewErrors(problems);
                    setPreviewRows(null);
                    return;
                }

                if (!isValidHttpUrl(url)) {
                    problems.push({
                        message: `Episode ${epNum}: URL is not a valid http(s) URL: ${url}`,
                    });
                    setPreviewErrors(problems);
                    setPreviewRows(null);
                    return;
                }

                if (movie?.episodes && movie.episodes[epKey]) {
                    conflicts.push(epNum);
                }

                rows.push({
                    id: epNum,
                    title,
                    duration: dur,
                    url,
                    status: Number(status),
                });
            }

            if (conflicts.length) {
                setPreviewErrors([
                    {
                        message: `These episode IDs already exist (change starting ID or count): ${conflicts.join(', ')}`,
                    },
                ]);
                setPreviewRows(null);
                return;
            }

            setPreviewRows(rows);
        },
        [
            duration,
            episodeCount,
            movie,
            startEpisodeId,
            status,
            titleTemplate,
            urlTemplate,
        ]
    );

    const updatePreviewCell = useCallback((index, field, rawValue) => {
        setPreviewRows((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            const row = { ...next[index] };

            if (field === 'id') {
                const v = parseInt(String(rawValue).trim(), 10);
                if (Number.isFinite(v) && v >= 1 && v <= 999) row.id = v;
            } else if (field === 'title') {
                row.title = rawValue;
            } else if (field === 'duration') {
                const v = Number(rawValue);
                if (Number.isFinite(v)) row.duration = v;
            } else if (field === 'url') {
                row.url = rawValue;
            } else if (field === 'status') {
                row.status = Number(rawValue);
            }

            next[index] = row;
            return next;
        });
    }, []);

    const validatePreviewForSubmit = useCallback(() => {
        const problems = [];
        if (!previewRows || previewRows.length === 0) return problems;

        const seenIds = new Set();
        for (let i = 0; i < previewRows.length; i++) {
            const row = previewRows[i];
            const epKey = `ep${row.id}`;

            if (!Number.isFinite(row.id) || row.id < 1 || row.id > 999) {
                problems.push({ message: `Row ${i + 1}: invalid episode ID.` });
            }
            if (seenIds.has(row.id)) problems.push({ message: `Duplicate episode ID ${row.id} in preview.` });
            seenIds.add(row.id);

            if (!row.title || row.title.trim().length < 1 || row.title.length > 64) {
                problems.push({ message: `Row ${i + 1}: title must be 1–64 characters.` });
            }
            if (!isValidHttpUrl(row.url.trim())) {
                problems.push({ message: `Row ${i + 1}: invalid URL.` });
            }
            const d = Number(row.duration);
            if (!Number.isFinite(d) || d < 0 || d > 99999) {
                problems.push({ message: `Row ${i + 1}: invalid duration.` });
            }
            if (![0, 2].includes(Number(row.status))) {
                problems.push({ message: `Row ${i + 1}: status must be Required Processing or Ready.` });
            }

            if (movie?.episodes && movie.episodes[epKey]) {
                problems.push({ message: `Episode ID ${row.id} already exists on the server.` });
            }
        }

        return problems;
    }, [movie?.episodes, previewRows]);

    const onBatchCreate = async (e) => {
        e.preventDefault();
        setErrors([]);

        const validationErrors = validatePreviewForSubmit();
        if (validationErrors.length) {
            setErrors(validationErrors);
            return;
        }

        dispatch(AppSetLoading(true));

        try {
            for (let i = 0; i < previewRows.length; i++) {
                const row = previewRows[i];
                await axios.post(
                    `/movies/${movieId}/episodes`,
                    {
                        id: row.id,
                        title: row.title.trim(),
                        duration: Number(row.duration),
                        url: row.url.trim(),
                        status: Number(row.status),
                    },
                    {
                        headers: { Authorization: `Bearer ${userToken}` },
                    }
                );
            }

            dispatch(UserFetchData(true));
            history.push(`/my-movies/${movieId}/edit`);
        } catch (err) {
            dispatch(AppSetLoading(false));
            const apiErrors = err.response && err.response.data && err.response.data.errors;
            if (apiErrors && Array.isArray(apiErrors)) {
                setErrors(apiErrors);
            } else {
                setErrors([{ message: err.message || 'Batch create failed.' }]);
            }
        }
    };

    const onClearPreview = (e) => {
        e.preventDefault();
        setPreviewRows(null);
        setPreviewErrors([]);
    };

    Debug(`[App][MainScreen][My Movies][Add Batch Episode] Render`);

    if (!movie) return <Redirect to="/my-movies" />;

    return (
        <div className="container text-white">
            <div className="row">
                <div className="col-lg-10 offset-lg-1">
                    <h5 className="mb-1">
                        Movie: <b>{movie.title}</b>
                    </h5>
                    <h3 className="mb-3">Add episodes (batch)</h3>

                    <p className="small text-muted mb-3">
                        Use placeholders in URL and title: <code>{'{n}'}</code> (1,2,3…),{' '}
                        <code>{'{nn}'}</code> (01,02…), <code>{'{nnn}'}</code> (001…). Or use a fixed episode
                        filename so only the last segment changes — e.g.{' '}
                        <code>https://cdn.example.com/v2/show/01.mp4</code> (other numbers in the path are left
                        alone; only <code>01.mp4</code> is updated per episode).
                    </p>

                    <form onSubmit={buildPreview}>
                        <div className="row">
                            <div className="col-md-3 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="start-id">
                                        First episode ID
                                    </label>
                                    <input
                                        type="number"
                                        id="start-id"
                                        className="form-control border"
                                        min="1"
                                        max="999"
                                        value={startEpisodeId}
                                        onChange={(e) => setStartEpisodeId(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="count">
                                        Episode count
                                    </label>
                                    <input
                                        type="number"
                                        id="count"
                                        className="form-control border"
                                        min="1"
                                        max="99"
                                        value={episodeCount}
                                        onChange={(e) => setEpisodeCount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="duration">
                                        Duration (sec)
                                    </label>
                                    <input
                                        type="number"
                                        id="duration"
                                        className="form-control border"
                                        min="0"
                                        max="99999"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className="form-select"
                                        value={status}
                                        onChange={(e) => setStatus(Number(e.target.value))}
                                    >
                                        <option value={0}>Required Processing</option>
                                        <option value={2}>Ready</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="url-template">
                                        URL template
                                    </label>
                                    <input
                                        type="text"
                                        id="url-template"
                                        className="form-control border"
                                        value={urlTemplate}
                                        onChange={(e) => setUrlTemplate(e.target.value)}
                                        placeholder="https://cdn.example.com/show/{nn}.mp4"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 mb-1">
                                <div className="form mb-3">
                                    <label className="form-label text-white font-weight-bold" htmlFor="title-template">
                                        Title template
                                    </label>
                                    <input
                                        type="text"
                                        id="title-template"
                                        className="form-control border"
                                        value={titleTemplate}
                                        onChange={(e) => setTitleTemplate(e.target.value)}
                                        placeholder={'Tập {nn} [720p]'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-2 mb-2">
                                <button type="button" onClick={onClickBack} className="btn btn-white btn-block">
                                    <i className="fas fa-arrow-circle-left me-1"></i>Back
                                </button>
                            </div>
                            <div className="col-md-10 mb-2">
                                <button type="submit" className="btn btn-info btn-block">
                                    <i className="fas fa-table me-1"></i>Preview episodes
                                </button>
                            </div>
                        </div>
                    </form>

                    {previewErrors.length > 0 && <ErrorList errors={previewErrors} />}
                    <ErrorList errors={errors} />

                    {previewRows && previewRows.length > 0 && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                <h4 className="mb-0">Preview ({previewRows.length} episodes)</h4>
                                <div>
                                    <button type="button" className="btn btn-outline-light btn-sm me-2" onClick={onClearPreview}>
                                        Clear preview
                                    </button>
                                    <button type="button" className="btn btn-danger pbg-accent" onClick={onBatchCreate}>
                                        <i className="fas fa-layer-group me-1"></i>Batch create
                                    </button>
                                </div>
                            </div>
                            <p className="small text-muted mb-2">
                                Edit any row below if needed, then click Batch create. Duration shown as time for convenience.
                            </p>
                            <div className="table-responsive mb-5">
                                <table className="table table-striped table-hover table-bordered table-dark table-sm">
                                    <thead className="text-center">
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Duration</th>
                                            <th>URL</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewRows.map((row, idx) => (
                                            <tr key={`${row.id}-${idx}`}>
                                                <td className="text-center">{idx + 1}</td>
                                                <td style={{ width: '88px' }}>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm border"
                                                        min={1}
                                                        max={999}
                                                        value={row.id}
                                                        onChange={(e) => updatePreviewCell(idx, 'id', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm border"
                                                        maxLength={64}
                                                        value={row.title}
                                                        onChange={(e) => updatePreviewCell(idx, 'title', e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ width: '120px' }}>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm border"
                                                        min={0}
                                                        max={99999}
                                                        value={row.duration}
                                                        onChange={(e) => updatePreviewCell(idx, 'duration', e.target.value)}
                                                    />
                                                    <span className="small text-muted d-block">
                                                        {DurationSecondToText(Number(row.duration) || 0)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm border"
                                                        value={row.url}
                                                        onChange={(e) => updatePreviewCell(idx, 'url', e.target.value)}
                                                    />
                                                </td>
                                                <td style={{ width: '140px' }}>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={row.status}
                                                        onChange={(e) => updatePreviewCell(idx, 'status', e.target.value)}
                                                    >
                                                        <option value={0}>Required Processing</option>
                                                        <option value={2}>Ready</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(AddBatchEpisode);
